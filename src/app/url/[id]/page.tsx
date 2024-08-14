import { getShortUrl } from "./actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Page({ params }: { params: { id: string } }) {
	const shortUrl = await getShortUrl(params.id);
	const headersList = headers();

	const domain = headersList.get("host");
	const fullShortUrl = `http://${domain}/${shortUrl?.shortCode}`;

	return (
		<>
			<Card className='max-w-lg mx-auto'>
				<CardHeader>
					<CardTitle>{shortUrl?.title ?? "No title found"}</CardTitle>
				</CardHeader>
				<CardContent>
					<Button variant='link'>
						Original URL:
						<Link href={shortUrl?.originalUrl as string}>
							{shortUrl?.originalUrl ?? "No original URL found"}
						</Link>
					</Button>
					<Button variant='link'>
						Shorten URL: <Link href={fullShortUrl}>{fullShortUrl ?? "No short URL found"}</Link>
					</Button>
				</CardContent>
			</Card>
		</>
	);
}
