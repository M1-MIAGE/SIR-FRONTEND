import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Card } from 'primereact/card'
import { Dropdown } from 'primereact/dropdown'
import { FloatLabel } from 'primereact/floatlabel'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Message } from 'primereact/message'
import { Tag } from 'primereact/tag'
import { useAuth } from '@/app/providers/auth-context'
import { organizerConcertApi } from '@/features/concert/api/organizer-concert.api'
import {
  createConcertFormSchema,
  type CreateConcertFormValues,
  type CreateConcertRequestDto
} from '@/features/concert/model/create-concert.types'
import { placeApi } from '@/features/place/api/place.api'
import type { PlaceDto } from '@/features/place/model/place.types'
import { mapApiErrorCode } from '@/shared/api/map-api-error'
import { ERROR_CODES, ROUTES } from '@/shared/config/routes'
import PageContainer from '@/shared/ui/layout/PageContainer'

const defaultEventDate = (): Date => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

export default function OrganizerCreateConcertPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [places, setPlaces] = useState<PlaceDto[]>([])
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(true)
  const [placesError, setPlacesError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateConcertFormValues>({
    resolver: zodResolver(createConcertFormSchema),
    defaultValues: {
      title: '',
      description: '',
      artist: '',
      date: defaultEventDate(),
      placeId: '',
      ticketUnitPrice: 49.9,
      ticketQuantity: 500,
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  })

  const selectedPlaceId = useWatch({ control, name: 'placeId' })

  const selectedPlace = useMemo(
    () => places.find((place) => place.placeId === selectedPlaceId) ?? null,
    [places, selectedPlaceId],
  )

  const placeOptions = useMemo(
    () =>
      places.map((place) => ({
        label: place.placeName,
        value: place.placeId,
      })),
    [places],
  )

  useEffect(() => {
    let active = true

    const run = async () => {
      setIsLoadingPlaces(true)
      setPlacesError(null)

      try {
        const response = await placeApi.listAll()
        if (!active) {
          return
        }
        setPlaces(response)
      } catch (error) {
        if (!active) {
          return
        }
        setPlacesError(mapApiErrorCode(error))
      } finally {
        if (active) {
          setIsLoadingPlaces(false)
        }
      }
    }

    void run()

    return () => {
      active = false
    }
  }, [])

  const submit = handleSubmit(async (values) => {
    setFormError(null)
    setSuccessMessage(null)

    const place = places.find((item) => item.placeId === values.placeId)
    if (!place) {
      setError('placeId', {
        type: 'manual',
        message: 'Selectionne un lieu valide.',
      })
      return
    }

    if (values.ticketQuantity > place.placeCapacity) {
      setError('ticketQuantity', {
        type: 'manual',
        message: `La quantite ne peut pas depasser ${place.placeCapacity}.`,
      })
      return
    }

    if (!user?.id) {
      setFormError("Impossible d'identifier l'organizer connecte. Recharge la session puis reessaie.")
      return
    }

    const payload: CreateConcertRequestDto = {
      title: values.title.trim(),
      description: values.description.trim(),
      artist: values.artist.trim(),
      date: values.date.toISOString(),
      organizerId: user.id,
      placeId: values.placeId,
      ticketUnitPrice: values.ticketUnitPrice,
      ticketQuantity: values.ticketQuantity,
    }

    try {
      await organizerConcertApi.create(payload)

      setSuccessMessage('Concert cree avec succes.')
      reset({
        title: '',
        description: '',
        artist: '',
        date: defaultEventDate(),
        placeId: '',
        ticketUnitPrice: 49.9,
        ticketQuantity: 500,
      })
    } catch (error) {
      const apiErrorCode = mapApiErrorCode(error)

      if (
        apiErrorCode === ERROR_CODES.BAD_REQUEST ||
        apiErrorCode === ERROR_CODES.UNPROCESSABLE_ENTITY
      ) {
        setFormError('Donnees invalides. Verifie les champs puis reessaie.')
        return
      }

      if (apiErrorCode === ERROR_CODES.CONFLICT) {
        setFormError('Un concert similaire existe deja pour ce lieu et ce creneau.')
        return
      }

      console.error(error)
      navigate(ROUTES.errors.byCode(apiErrorCode), { replace: true })
    }
  })

  return (
    <PageContainer
      title="Creer un concert"
      subtitle="Formulaire de creation pour les organisateurs."
      actions={<Tag value={`${places.length} lieux`} severity="info" />}
    >
      <div className="grid-12">
        <div className="col-12 col-lg-8">
          <Card title="Nouveau concert">
            <form className="stack" onSubmit={submit} noValidate>
              {placesError ? (
                <Message severity="warn" text={`Erreur chargement lieux: ${placesError}`} />
              ) : null}
              {formError ? <Message severity="error" text={formError} /> : null}
              {successMessage ? <Message severity="success" text={successMessage} /> : null}

              <div className="form-grid">
                <Controller
                  name="title"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="auth-field">
                      <FloatLabel>
                        <InputText
                          id="concert-title"
                          value={field.value}
                          onBlur={field.onBlur}
                          onChange={(event) => field.onChange(event.target.value)}
                          className={fieldState.invalid ? 'p-invalid' : undefined}
                        />
                        <label htmlFor="concert-title">Titre</label>
                      </FloatLabel>
                      {fieldState.error?.message ? (
                        <small className="p-error">{fieldState.error.message}</small>
                      ) : null}
                    </div>
                  )}
                />

                <Controller
                  name="artist"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="auth-field">
                      <FloatLabel>
                        <InputText
                          id="concert-artist"
                          value={field.value}
                          onBlur={field.onBlur}
                          onChange={(event) => field.onChange(event.target.value)}
                          className={fieldState.invalid ? 'p-invalid' : undefined}
                        />
                        <label htmlFor="concert-artist">Artiste</label>
                      </FloatLabel>
                      {fieldState.error?.message ? (
                        <small className="p-error">{fieldState.error.message}</small>
                      ) : null}
                    </div>
                  )}
                />

                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="auth-field form-grid-field-span-2">
                      <FloatLabel>
                        <InputTextarea
                          id="concert-description"
                          value={field.value}
                          onBlur={field.onBlur}
                          onChange={(event) => field.onChange(event.target.value)}
                          rows={5}
                          autoResize
                          className={fieldState.invalid ? 'p-invalid' : undefined}
                        />
                        <label htmlFor="concert-description">Description</label>
                      </FloatLabel>
                      {fieldState.error?.message ? (
                        <small className="p-error">{fieldState.error.message}</small>
                      ) : null}
                    </div>
                  )}
                />

                <Controller
                  name="date"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="auth-field">
                      <FloatLabel>
                        <Calendar
                          inputId="concert-date"
                          value={field.value}
                          onBlur={field.onBlur}
                          onChange={(event) =>
                            field.onChange(event.value instanceof Date ? event.value : new Date(''))
                          }
                          showIcon
                          showTime
                          hourFormat="24"
                          dateFormat="dd/mm/yy"
                          minDate={new Date()}
                          inputClassName={fieldState.invalid ? 'p-invalid' : undefined}
                        />
                        <label htmlFor="concert-date">Date et heure</label>
                      </FloatLabel>
                      {fieldState.error?.message ? (
                        <small className="p-error">{fieldState.error.message}</small>
                      ) : null}
                    </div>
                  )}
                />

                <Controller
                  name="placeId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="auth-field">
                      <FloatLabel>
                        <Dropdown
                          inputId="concert-place"
                          value={field.value}
                          options={placeOptions}
                          optionLabel="label"
                          optionValue="value"
                          filter
                          disabled={isLoadingPlaces}
                          placeholder="Selectionner un lieu"
                          onBlur={field.onBlur}
                          onChange={(event) => field.onChange((event.value as string) ?? '')}
                          className={fieldState.invalid ? 'p-invalid' : undefined}
                        />
                        <label htmlFor="concert-place">Lieu</label>
                      </FloatLabel>
                      {fieldState.error?.message ? (
                        <small className="p-error">{fieldState.error.message}</small>
                      ) : null}
                    </div>
                  )}
                />

                <Controller
                  name="ticketUnitPrice"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="auth-field">
                      <FloatLabel>
                        <InputNumber
                          inputId="concert-ticket-price"
                          value={field.value}
                          onBlur={field.onBlur}
                          onValueChange={(event) => field.onChange(event.value ?? 0)}
                          mode="currency"
                          currency="EUR"
                          locale="fr-FR"
                          min={0}
                          minFractionDigits={2}
                          maxFractionDigits={2}
                          inputClassName={fieldState.invalid ? 'p-invalid' : undefined}
                        />
                        <label htmlFor="concert-ticket-price">Prix unitaire</label>
                      </FloatLabel>
                      {fieldState.error?.message ? (
                        <small className="p-error">{fieldState.error.message}</small>
                      ) : null}
                    </div>
                  )}
                />

                <Controller
                  name="ticketQuantity"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="auth-field">
                      <FloatLabel>
                        <InputNumber
                          inputId="concert-ticket-quantity"
                          value={field.value}
                          onBlur={field.onBlur}
                          onValueChange={(event) => field.onChange(event.value ?? 0)}
                          min={0}
                          max={selectedPlace?.placeCapacity}
                          useGrouping={false}
                          inputClassName={fieldState.invalid ? 'p-invalid' : undefined}
                        />
                        <label htmlFor="concert-ticket-quantity">Quantite de billets</label>
                      </FloatLabel>
                      {fieldState.error?.message ? (
                        <small className="p-error">{fieldState.error.message}</small>
                      ) : null}
                    </div>
                  )}
                />
              </div>

              <Button
                type="submit"
                label="Creer le concert"
                icon="pi pi-plus"
                loading={isSubmitting}
                disabled={isLoadingPlaces || placeOptions.length === 0}
              />
            </form>
          </Card>
        </div>

        <div className="col-12 col-lg-4">
          <Card title="Lieu selectionne">
            {selectedPlace ? (
              <div className="stack">
                <strong>{selectedPlace.placeName}</strong>
                <span>
                  {selectedPlace.placeAddress}, {selectedPlace.placeZipCode} {selectedPlace.placeCity}
                </span>
                <Tag value={`Capacite: ${selectedPlace.placeCapacity}`} severity="success" />
              </div>
            ) : (
              <p>Selectionne un lieu pour afficher ses details.</p>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
