import { Box, Fade } from "@mui/material";

interface ImageViewerProps {
	src: string;
	alt?: string;
	fadeMs: number;
}

function ImageViewer({ src, alt = "Estímulo visual", fadeMs }: ImageViewerProps) {
	return (
		<Box
			sx={{
				flex: 1,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				minHeight: 0,
				width: "100%",
				p: { xs: 1.5, sm: 2.5 },
			}}
		>
			<Fade in timeout={fadeMs} key={src}>
				<Box
					component="img"
					src={src}
					alt={alt}
					sx={{
						width: "100%",
						height: "100%",
						maxWidth: "min(100%, 1100px)",
						maxHeight: { xs: "60vh", sm: "68vh", md: "72vh" },
						objectFit: "contain",
						display: "block",
						borderRadius: 3,
						boxShadow: "0 20px 60px rgba(15, 23, 42, 0.16)",
						bgcolor: "#F8FAFC",
					}}
				/>
			</Fade>
		</Box>
	);
}

export default ImageViewer;
