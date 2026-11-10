import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router"
import useRequest from "./useRequest"
import { verifyEmail } from "../services/authService.js"

function useVerifyEmail() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('verification_token')
    const navigate = useNavigate()
    const { loading, response, error, sendRequest } = useRequest()

    useEffect(
        () => {
            if (token) {
                sendRequest(() => verifyEmail(token))
            }
        },
        [token]
    )

    useEffect(
        () => {
            if (!response) return
            const timeout = setTimeout(() => navigate('/login', { replace: true }), 2000)
            return () => clearTimeout(timeout)
        },
        [response]
    )

    return {
        token,
        loading,
        response,
        error
    }
}

export default useVerifyEmail
