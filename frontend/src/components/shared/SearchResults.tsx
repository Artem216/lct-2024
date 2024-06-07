import { Models } from "appwrite"
import Loader from "./Loader"
import GridPostList from "./GridPostList"

interface SearchResultProps {
    isSearchFetching: boolean,
    searchedPosts: Models.DocumentList<Models.Document>,
}

const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultProps) => {
    if(isSearchFetching) return <Loader />

    if(searchedPosts && searchedPosts.documents.length > 0) {
        return (
            <GridPostList posts={searchedPosts.documents}/>
        )
    }

    return (
        <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    )
}

export default SearchResults