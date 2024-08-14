import { validateRequest } from "@/lib/validate-request";

import Link from "next/link";
import { logout, shortenUrl } from "./actions";

export default async function Home() {
	// const { user } = await validateRequest();
	const user = true;
	return (
		<main className='flex min-h-screen flex-col items-center p-24 text-xl gap-10'>
			{user && (
				<>
					<form action={logout}>
						<button className='px-5 py-3 bg-red-500 text-white rounded-md'>Sign out</button>
					</form>

					{/* A form here to short a url */}
					<form action={shortenUrl} className='flex flex-col gap-5'>
						<label htmlFor='url' className='text-2xl font-bold'>
							Enter URL
						</label>
						<input
							type='text'
							name='url'
							id='url'
							className='text-2xl border-2 border-gray-300 rounded-md p-2'
						/>
						<button type='submit' className='px-5 py-3 bg-blue-500 text-white rounded-md'>
							Shorten
						</button>
					</form>
				</>
			)}
			{!user && (
				<Link href='/login' className='px-5 py-3 bg-blue-500 text-white rounded-md'>
					Login
				</Link>
			)}
			{!user && (
				<Link href='/signup' className='px-5 py-3 bg-slate-500 text-white rounded-md'>
					Signup
				</Link>
			)}
		</main>
	);
}
