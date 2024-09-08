import { readFileSync } from "node:fs";
import satori from "satori";
import sharp from "sharp";

const path = import.meta.env.MODE === "production" ? "" : "public/";

const imgBase64 = readFileSync(
	new URL(`../../${path}og-image-background.png`, import.meta.url),
	{ encoding: "base64" },
);
const imgDataUrl = `data:image/png;base64,${imgBase64}`;

export async function getOgImage(text: string) {
	const fontData = (await getFontData()) as ArrayBuffer;
	const svg = await satori(
		<main style={{ position: "relative" }}>
			<img src={imgDataUrl} alt="og-image" />
			<h1
				style={{
					maxWidth: "1040px",
					fontSize: "48px",
					position: "absolute",
					top: "80px",
					left: "80px",
				}}
			>
				{text}
			</h1>
		</main>,
		{
			width: 1200,
			height: 630,
			fonts: [
				{
					name: "Noto Sans JP",
					data: fontData,
					style: "normal",
				},
			],
		},
	);

	return await sharp(Buffer.from(svg)).png().toBuffer();
}

async function getFontData() {
	const API = "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700";

	const css = await (
		await fetch(API, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
			},
		})
	).text();

	const resource = css.match(
		/src: url\((.+)\) format\('(opentype|truetype)'\)/,
	);

	if (!resource) return;

	return await fetch(resource[1]).then((res) => res.arrayBuffer());
}
