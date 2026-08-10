/****************************************************************************************
* Atomically authorizes one logical device for the authenticated license owner.
*
* The caller never receives direct INSERT/UPDATE/DELETE rights on licensed_devices.
* The row-level lock on licenses serializes every authorization attempt for a license,
* so a concurrent request cannot consume an extra device slot.
****************************************************************************************/

CREATE OR REPLACE FUNCTION public.authorize_license_device(
    p_license_id UUID,
    p_device_id UUID,
    p_device_name TEXT,
    p_device_platform TEXT
)
RETURNS TABLE (authorization_status TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_license public.licenses%ROWTYPE;
    v_device public.licensed_devices%ROWTYPE;
    v_active_device_count INTEGER;
BEGIN
    -- The license row is the per-license serialization point for all device changes.
    SELECT *
    INTO v_license
    FROM public.licenses
    WHERE id = p_license_id
      AND user_id = auth.uid()
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN QUERY SELECT 'LICENSE_NOT_FOUND'::TEXT;
        RETURN;
    END IF;

    IF v_license.license_status <> 'ACTIVE' THEN
        RETURN QUERY SELECT 'LICENSE_NOT_ACTIVE'::TEXT;
        RETURN;
    END IF;

    IF v_license.expires_at IS NULL OR v_license.expires_at <= NOW() THEN
        RETURN QUERY SELECT 'LICENSE_EXPIRED'::TEXT;
        RETURN;
    END IF;

    IF p_device_id IS NULL
       OR NULLIF(BTRIM(p_device_name), '') IS NULL
       OR p_device_platform IS NULL
       OR p_device_platform NOT IN ('WINDOWS', 'MACOS', 'ANDROID', 'IOS', 'LINUX') THEN
        RETURN QUERY SELECT 'INVALID_DEVICE_METADATA'::TEXT;
        RETURN;
    END IF;

    SELECT *
    INTO v_device
    FROM public.licensed_devices
    WHERE license_id = v_license.id
      AND device_id = p_device_id;

    IF v_device.id IS NOT NULL AND v_device.is_active THEN
        UPDATE public.licensed_devices
        SET last_seen_at = NOW(),
            device_name = BTRIM(p_device_name),
            device_platform = p_device_platform
        WHERE id = v_device.id;

        RETURN QUERY SELECT 'AUTHORIZED_EXISTING'::TEXT;
        RETURN;
    END IF;

    SELECT COUNT(*)::INTEGER
    INTO v_active_device_count
    FROM public.licensed_devices
    WHERE license_id = v_license.id
      AND is_active = TRUE;

    IF v_active_device_count >= v_license.max_devices THEN
        RETURN QUERY SELECT 'DEVICE_LIMIT_REACHED'::TEXT;
        RETURN;
    END IF;

    IF v_device.id IS NOT NULL THEN
        UPDATE public.licensed_devices
        SET is_active = TRUE,
            last_seen_at = NOW(),
            device_name = BTRIM(p_device_name),
            device_platform = p_device_platform
        WHERE id = v_device.id;
    ELSE
        INSERT INTO public.licensed_devices (
            license_id,
            device_id,
            device_name,
            device_platform,
            is_active,
            last_seen_at
        ) VALUES (
            v_license.id,
            p_device_id,
            BTRIM(p_device_name),
            p_device_platform,
            TRUE,
            NOW()
        );
    END IF;

    RETURN QUERY SELECT 'AUTHORIZED_NEW'::TEXT;
END;
$$;

REVOKE ALL ON FUNCTION public.authorize_license_device(UUID, UUID, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.authorize_license_device(UUID, UUID, TEXT, TEXT) TO authenticated;
