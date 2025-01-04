import { gql } from "@apollo/client"

export const LOGIN_USER = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
			user {
				username
				_id
			}
		}
	}
`

export const ADD_USER = gql`
	mutation AddUser($userInput: UserInput!) {
		addUser(userInput: $userInput) {
			user {
				_id
				username
				email
			}
			token
		}
	}
`

export const SAVE_BOOK = gql`
	mutation saveBook($bookData: BookInput!) {
		saveBook(bookData: $bookData) {
			_id
			username
			email
			savedBooks {
				bookId
				authors
				description
				title
				image
				link
			}
		}
	}
`

export const REMOVE_BOOK = gql`
	mutation removeBook($bookId: String!) {
		removeBook(bookId: $bookId) {
			_id
			username
			email
			savedBooks {
				bookId
				authors
				description
				title
				image
				link
			}
		}
	}
`
