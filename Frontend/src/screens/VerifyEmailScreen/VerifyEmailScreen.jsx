import useVerifyEmail from '../../hooks/useVerifyEmail'
import VerifyEmail from '../../components/VerifyEmail/VerifyEmail'

function VerifyEmailScreen() {
    const { token, loading, response, error } = useVerifyEmail()

    return (
        <VerifyEmail
            token={token}
            loading={loading}
            response={response}
            error={error}
        />
    )
}

export default VerifyEmailScreen
