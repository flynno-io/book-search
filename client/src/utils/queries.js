import { gql } from "@apollo/client"

export const GET_ME = gql`
	{
		me {
			username
			email
			bookCount
			_id
			savedBooks {
				title
				link
				image
				description
				bookId
				authors
			}
		}
	}
`
