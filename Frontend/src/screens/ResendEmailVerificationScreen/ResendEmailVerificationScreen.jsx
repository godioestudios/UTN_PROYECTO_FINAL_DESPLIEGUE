import useResendEmailVerification from '../../hooks/useResendEmailVerification'
import ResendEmailVerification from '../../components/ResendEmailVerification/ResendEmailVerification'

function ResendEmailVerificationScreen() {
    const {
        formState,
        handleChangeInput,
        handleResend,
        loading,
        response,
        error
    } = useResendEmailVerification()

    return (
        <ResendEmailVerification
            formState={formState}
            handleChangeInput={handleChangeInput}
            handleResend={handleResend}
            loading={loading}
            response={response}
            error={error}
        />
    )
}

export default ResendEmailVerificationScreen
