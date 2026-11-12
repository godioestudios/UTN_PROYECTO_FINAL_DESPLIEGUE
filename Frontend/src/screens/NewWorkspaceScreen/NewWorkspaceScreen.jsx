import React from 'react'
import { Link, useNavigate } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { createWorkspace } from '../../services/workspaceService'
import TextField from '../../Components/Form/TextField'
import FormButton from '../../Components/Form/FormButton'
import Alert from '../../Components/Alert/Alert'

const DESC_MAX_LENGTH = 1000

function NewWorkspaceScreen() {
  const initial_state = { name: '', description: '' }
  const { formState, handleChangeInput } = useForm(initial_state)
  const { loading, response, error, sendRequest } = useRequest()
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    const created = await sendRequest(
      () => createWorkspace(formState.name, formState.description)
    )
    if (created) {
      navigate('/')
    }
  }

  return (
    <div className='form-screen'>
      <div className='form-card'>
        <img
          className='form-logo'
          alt='Slack'
          height='26'
          title='Slack'
          src='https://a.slack-edge.com/bv1-13/slack_logo-97f7334.svg'
        />
        <h1 className='form-title form-title--wrap'>Asigna un nombre a tu espacio de trabajo de Slack</h1>
        <p className='form-subtitle'>
          Elige algo que tu equipo reconozca fácilmente, como el nombre de la
          empresa o del equipo. Puedes modificarlo cuando quieras.
        </p>
        <form className='form-stack' onSubmit={handleSubmit}>
          <TextField
            name='name'
            label='Nombre:'
            type='text'
            value={formState.name}
            onChange={handleChangeInput}
            autoComplete='off'
            required
          />
          <div className='form-field'>
            <label className='form-field__label' htmlFor='description'>
              Descripción:
            </label>
            <textarea
              className='form-field__input form-field__textarea'
              id='description'
              name='description'
              value={formState.description}
              onChange={handleChangeInput}
              maxLength={DESC_MAX_LENGTH}
            />
            <span className='form-field__counter'>
              {formState.description.length}/{DESC_MAX_LENGTH}
            </span>
          </div>
          {
            error
            &&
            !loading
            &&
            <Alert type='error'>{error}</Alert>
          }
          <FormButton loading={loading} loadingText='Creando…'>Crear espacio de trabajo</FormButton>
          {
            response
            &&
            !loading
            &&
            <Alert type='success'>Espacio de trabajo creado correctamente</Alert>
          }
        </form>
        <p className='form-footer'>
          <Link to='/'>Volver al inicio</Link>
        </p>
      </div>
    </div>
  )
}

export default NewWorkspaceScreen
