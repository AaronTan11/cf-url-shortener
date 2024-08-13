import { validateRequest } from "@/lib/validate-request";
import Image from "next/image";
import Link from "next/link";
import { logout } from "./actions";

export default async function Home() {
	const { user } = await validateRequest();
	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24'>
			<div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex'>
				{user && (
					<form action={logout}>
						<button>Sign out</button>
					</form>
				)}
				{!user && <Link href='/login'>Login</Link>}
				{!user && <Link href='/signup'>Signup</Link>}
			</div>
		</main>
	);
}
