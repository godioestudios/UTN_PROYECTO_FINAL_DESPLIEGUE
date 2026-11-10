import useForm from "./useForm"
import useRequest from "./useRequest"
import { resendVerificationEmail } from "../services/authService.js"

function useResendEmailVerification() {
    const { formState, handleChangeInput } = useForm({ email: '' })
    const { loading, response, error, sendRequest } = useRequest()

    function handleResend(event) {
        event.preventDefault()
        sendRequest(() => resendVerificationEmail(formState.email))
    }

    return {
        formState,
        handleChangeInput,
        handleResend,
        loading,
        response,
        error
    }
}

export default useResendEmailVerification
