import { getShortUrl } from "./actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Page({ params }: { params: { id: string } }) {
	const shortUrl = await getShortUrl(params.id);
	const fullShortUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${shortUrl?.shortCode}`;
	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>{shortUrl?.title ?? "No title found"}</CardTitle>
				</CardHeader>
				<CardContent>
					<Button variant='link'>
						{" "}
						Original URL: {shortUrl?.originalUrl ?? "No original URL found"}
					</Button>
					<Button variant='link'> Shorten URL: {fullShortUrl ?? "No short URL found"}</Button>
				</CardContent>
			</Card>
		</>
	);
}
