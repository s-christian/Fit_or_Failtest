/* Resources:
 * https://nextjs.org/docs/basic-features/pages
 * https://nextjs.org/docs/basic-features/data-fetching
 */

import axios from "axios";

import Layout from "../../components/Layout";

// Component function only takes parameter "props" (passed by getServerSideProps())
// Notice that this is a function that does stuff other than immediately return HTML data.
// I need to check if the user exists or not in order to deliver the correct HTML content,
// so I start this function with the proper {} instead of ().
function Userpage({ user, unregisteredUsername }) {
	// If user does not exist
	if (!user)
		return (
			<Layout title="User not found">
				<div className="container">
					<img src="/assets/images/user_not_found.png" />
					<h1>
						User <span id="username">{unregisteredUsername}</span> does not exist!
					</h1>

					{/* Temporary CSS styling */}
					<style jsx>{`
						.container {
							display: flex;
							align-items: center;
							justify-content: center;
						}

						#username {
							color: white;
							font-weight: 900;
							text-shadow: 2px 2px gray;
						}
					`}</style>
				</div>
			</Layout>
		);

	// If user exists
	return (
		<Layout title={`${user.username} · player info`}>
			<div className="container">
				<img src={user.profile_picture_url} alt={`${user.username}'s profile picture`} />
				<h1 id="username">{user.username}</h1>
				<p>Points: {user.points}</p>
				<p>Wins: {user.wins}</p>
				<p>Team: {user.team}</p>
				<p>Member since: {user.register_date}</p>
				<p>Account type: {user.account_type}</p>

				{/* Temporary CSS styling */}
				<style jsx>{`
					.container {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						width: 500px;
						height: 500px;
						background-color: lightgreen;
						border-radius: 5%;
						border: 2px solid black;
					}

					#username {
						color: white;
						font-weight: 900;
						text-shadow: 2px 2px gray;
					}
				`}</style>
			</div>
		</Layout>
	);
}

export async function getServerSideProps({ params }) {
	// 'context' contains a bunch of information.
	// We're extracting the dynamic route 'params' from 'context'.
	// In our case, we only care about the username from our dynamic route.
	// We use this username to send a GET request to the API on our backend
	// to get all of that user's information in order to populate the page.
	const { username } = params;

	let user;
	try {
		user = await axios.get(`http://localhost:3000/api/users/${username}`);
		// axios returns a large JSON object with all the request and response information.
		// We only need the data from the 'data' field that it returns. This contains the API's response.
		user = user.data.user;
	} catch (err) {
		console.error({ msg: "Cannot reach api endpoint", err });
	}

	// Note to self: When loggin an object (such as the JSON data below), the object has to be the only parameter.
	// Why? Ex: 'console.log("user: " + user)' results in an output of "user: [object Object]".
	// console.log(user);

	// Pass data to the page via props
	return {
		props: {
			user: user,
			unregisteredUsername: username
		}
	};
}

export default Userpage;