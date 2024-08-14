import { Form } from "@/components/custom/form";
import { signup } from "./actions";

export default async function Page() {
	return (
		<main className='flex min-h-screen flex-col items-center p-24 text-xl gap-10'>
			<h1 className='text-4xl font-bold'>Create an account</h1>
			<form action={signup} className='flex flex-col gap-5'>
				<label htmlFor='username' className='text-2xl font-bold'>
					Username
				</label>
				<input
					name='username'
					id='username'
					className='text-2xl border-2 border-gray-300 rounded-md p-2'
				/>
				<br />
				<label htmlFor='password' className='text-2xl font-bold'>
					Password
				</label>
				<input
					type='password'
					name='password'
					id='password'
					className='text-2xl border-2 border-gray-300 rounded-md p-2'
				/>
				<br />
				<button className='px-5 py-3 bg-blue-500 text-white rounded-md'>Continue</button>
			</form>
		</main>
	);
}
