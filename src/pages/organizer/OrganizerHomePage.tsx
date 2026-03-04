import {useCallback, useEffect, useMemo, useState} from 'react'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import {Controller, useForm} from 'react-hook-form'
import {useNavigate} from 'react-router-dom'
import {Button} from 'primereact/button'
import {Calendar} from 'primereact/calendar'
import {Card} from 'primereact/card'
import {Column} from 'primereact/column'
import {DataTable} from 'primereact/datatable'
import {InputNumber} from 'primereact/inputnumber'
import {InputSwitch} from 'primereact/inputswitch'
import {Message} from 'primereact/message'
import {SelectButton} from 'primereact/selectbutton'
import {Skeleton} from 'primereact/skeleton'
import {TabPanel, TabView} from 'primereact/tabview'
import {Tag} from 'primereact/tag'
import {
    isOrganizerStatsSchemaError,
    organizerStatsApi,
} from '@/features/stats/api/organizer-stats.api'
import {
    statsGranularitySchema,
    type OrganizerConcertStatsQueryDto,
    type OrganizerConcertStatsResponseDto,
    type OrganizerStatsBreakdownRowDto,
    type OrganizerStatsRankingRowDto,
    type OrganizerStatsTimelineRowDto,
    type StatsGranularity,
} from '@/features/stats/model/organizer-stats.types'
import {mapApiErrorCode} from '@/shared/api/map-api-error'
import {ERROR_CODES, ROUTES} from '@/shared/config/routes'
import {
    currencyFormatter,
    dateTimeFormatter,
    numberFormatter,
    percentFormatter,
} from '@/shared/lib/formatters'
import PageContainer from '@/shared/ui/layout/PageContainer'
import {rowsPerPageOptions} from "@/shared/lib/table.ts";

const granularityOptions: { label: string; value: StatsGranularity }[] = [
    {label: 'Jour', value: 'DAY'},
    {label: 'Semaine', value: 'WEEK'},
    {label: 'Mois', value: 'MONTH'},
]

const statsFiltersFormSchema = z
    .object({
        from: z.date(),
        to: z.date(),
        granularity: statsGranularitySchema,
        top: z.number().int().min(1).max(100),
        includeConcerts: z.boolean(),
    })
    .refine((value) => value.from <= value.to, {
        path: ['to'],
        message: 'La date de fin doit etre superieure ou egale a la date de debut.',
    })

type StatsFiltersFormValues = z.infer<typeof statsFiltersFormSchema>

const buildDefaultFilters = (): StatsFiltersFormValues => {
    const now = new Date()
    const currentYear = now.getFullYear()

    const to = new Date(currentYear, 11, 31)
    const from = new Date(currentYear, 0, 1)

    return {
        from,
        to,
        granularity: 'MONTH',
        top: 10,
        includeConcerts: true,
    }
}

const toStatsQuery = (values: StatsFiltersFormValues): OrganizerConcertStatsQueryDto => ({
    from: values.from.toISOString(),
    to: values.to.toISOString(),
    granularity: values.granularity,
    top: values.top,
    includeConcerts: values.includeConcerts,
})

const formatPercent = (value: number | null): string =>
    value === null ? 'N/A' : `${percentFormatter.format(value)} %`

const deltaSeverity = (value: number | null): 'success' | 'danger' | 'info' => {
    if (value === null) {
        return 'info'
    }

    if (value > 0) {
        return 'success'
    }

    if (value < 0) {
        return 'danger'
    }

    return 'info'
}

const statusSeverity = (status: string): 'success' | 'warning' | 'danger' | 'info' => {
    const normalized = status.toUpperCase()
    if (normalized.includes('REJECT')) {
        return 'danger'
    }
    if (normalized.includes('PENDING')) {
        return 'warning'
    }
    if (normalized.includes('PUBLISH') || normalized.includes('APPROV')) {
        return 'success'
    }
    return 'info'
}

export default function OrganizerHomePage() {
    const navigate = useNavigate()

    const [stats, setStats] = useState<OrganizerConcertStatsResponseDto | null>(null)
    const [apiError, setApiError] = useState<string | null>(null)
    const [apiDebugDetails, setApiDebugDetails] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const {
        control,
        getValues,
        handleSubmit,
        reset,
        formState: {isSubmitting},
    } = useForm<StatsFiltersFormValues>({
        resolver: zodResolver(statsFiltersFormSchema),
        defaultValues: buildDefaultFilters(),
        mode: 'onTouched',
        reValidateMode: 'onChange',
    })

    const loadStats = useCallback(
        async (values: StatsFiltersFormValues) => {
            setIsLoading(true)
            setApiError(null)
            setApiDebugDetails(null)

            try {
                const response = await organizerStatsApi.getMyConcertsStats(toStatsQuery(values))
                setStats(response)
            } catch (error) {
                if (isOrganizerStatsSchemaError(error)) {
                    const details = error.issues
                        .map((issue) => `- ${issue.path.join('.') || '<root>'}: ${issue.message}`)
                        .join('\n')

                    if (import.meta.env.DEV) {
                        console.groupCollapsed(`[stats] zod parse failed (${error.stage})`)
                        console.log('issues', error.issues)
                        console.log('payload', error.payload)
                        console.groupEnd()
                    }

                    setApiError(ERROR_CODES.UNEXPECTED)
                    setApiDebugDetails(`Stage: ${error.stage}\n${details}`)
                    return
                }

                const code = mapApiErrorCode(error)

                if (code === ERROR_CODES.UNAUTHORIZED || code === ERROR_CODES.FORBIDDEN) {
                    navigate(ROUTES.errors.byCode(code), {replace: true})
                    return
                }

                setApiError(code)
            } finally {
                setIsLoading(false)
            }
        },
        [navigate],
    )

    useEffect(() => {
        void loadStats(getValues())
    }, [getValues, loadStats])

    const submitFilters = handleSubmit(async (values) => {
        await loadStats(values)
    })

    const resetFilters = () => {
        const defaults = buildDefaultFilters()
        reset(defaults)
        void loadStats(defaults)
    }

    const kpis = useMemo(() => {
        if (!stats) {
            return []
        }

        const {overview} = stats
        return [
            {
                icon: 'pi pi-ticket',
                label: 'Concerts totaux',
                value: numberFormatter.format(overview.totalConcerts),
            },
            {
                icon: 'pi pi-check-circle',
                label: 'Publiés',
                value: numberFormatter.format(overview.publishedConcerts),
            },
            {
                icon: 'pi pi-clock',
                label: 'En attente',
                value: numberFormatter.format(overview.pendingConcerts),
            },
            {
                icon: 'pi pi-times-circle',
                label: 'Rejetés',
                value: numberFormatter.format(overview.rejectedConcerts),
            },
            {
                icon: 'pi pi-calendar-plus',
                label: 'A venir',
                value: numberFormatter.format(overview.upcomingConcerts),
            },
            {
                icon: 'pi pi-calendar-minus',
                label: 'Passés',
                value: numberFormatter.format(overview.pastConcerts),
            },
            {
                icon: 'pi pi-shopping-cart',
                label: 'Billets vendus',
                value: numberFormatter.format(overview.totalTicketSold),
            },
            {
                icon: 'pi pi-chart-line',
                label: 'Taux global',
                value: formatPercent(overview.globalSellThroughRatePct),
            },
            {
                icon: 'pi pi-euro',
                label: 'CA brut',
                value: currencyFormatter.format(overview.grossRevenue),
            },
            {
                icon: 'pi pi-wallet',
                label: 'Prix moyen billet',
                value: currencyFormatter.format(overview.averageTicketPrice),
            },
            {
                icon: 'pi pi-calculator',
                label: 'CA moyen / concert',
                value: currencyFormatter.format(overview.averageRevenuePerConcert),
            },
        ]
    }, [stats])

    const renderBreakdownTable = (rows: OrganizerStatsBreakdownRowDto[]) => (
        <DataTable
            value={rows}
            size="small"
            stripedRows
            paginator
            rows={5}
            rowsPerPageOptions={rowsPerPageOptions}
            emptyMessage="Aucune donnée trouvée"
        >
            <Column field="label" header="Libelle" sortable/>
            <Column
                field="concertCount"
                header="Concerts"
                sortable
                body={(row: OrganizerStatsBreakdownRowDto) => (
                    <span className="organizer-stat-cell">{numberFormatter.format(row.concertCount)}</span>
                )}
            />
            <Column
                header="Vendus / Total"
                body={(row: OrganizerStatsBreakdownRowDto) => (
                    <span className="organizer-stat-cell">
            {numberFormatter.format(row.ticketSold)} / {numberFormatter.format(row.ticketQuantity)}
          </span>
                )}
            />
            <Column
                field="sellThroughRatePct"
                header="Sell-through"
                sortable
                body={(row: OrganizerStatsBreakdownRowDto) => (
                    <span className="organizer-stat-cell">{formatPercent(row.sellThroughRatePct)}</span>
                )}
            />
            <Column
                field="grossRevenue"
                header="CA brut"
                sortable
                body={(row: OrganizerStatsBreakdownRowDto) => (
                    <span className="organizer-stat-cell">{currencyFormatter.format(row.grossRevenue)}</span>
                )}
            />
            <Column
                field="sharePct"
                header="Part"
                sortable
                body={(row: OrganizerStatsBreakdownRowDto) => (
                    <span className="organizer-stat-cell">{formatPercent(row.sharePct)}</span>
                )}
            />
        </DataTable>
    )

    const renderRankingTable = (rows: OrganizerStatsRankingRowDto[]) => (
        <DataTable value={rows} size="small" stripedRows emptyMessage="Aucune donnée trouvée">
            <Column field="concertTitle" header="Concert"/>
            <Column
                field="concertArtist"
                header="Artiste"
                body={(row: OrganizerStatsRankingRowDto) => row.concertArtist ?? 'N/A'}
            />
            <Column
                field="concertDate"
                header="Date"
                body={(row: OrganizerStatsRankingRowDto) => dateTimeFormatter.format(new Date(row.concertDate))}
            />
            <Column
                field="concertStatus"
                header="Statut"
                body={(row: OrganizerStatsRankingRowDto) => (
                    <Tag
                        value={row.concertStatus}
                        severity={statusSeverity(row.concertStatus)}
                        className="organizer-status-tag"
                    />
                )}
            />
            <Column
                header="Vendus / Total"
                body={(row: OrganizerStatsRankingRowDto) => (
                    <span className="organizer-stat-cell">
            {numberFormatter.format(row.ticketSold)} / {numberFormatter.format(row.ticketQuantity)}
          </span>
                )}
            />
            <Column
                field="sellThroughRatePct"
                header="Sell-through"
                body={(row: OrganizerStatsRankingRowDto) => formatPercent(row.sellThroughRatePct)}
            />
            <Column
                field="grossRevenue"
                header="CA brut"
                body={(row: OrganizerStatsRankingRowDto) => currencyFormatter.format(row.grossRevenue)}
            />
        </DataTable>
    )

    return (
        <PageContainer
            title="Dashboard Organizer"
            subtitle="Pilotage de vos concerts avec statistiques avancees."
            actions={
                <Button
                    label="Creer un concert"
                    icon="pi pi-plus"
                    onClick={() => navigate(ROUTES.organizerCreateConcert())}
                />
            }
        >
            <div className="organizer-dashboard">
                <Card title="Filtres statistiques" className="organizer-filter-card">
                    <form className="organizer-filter-form" onSubmit={submitFilters} noValidate>
                        <div className="organizer-filter-grid">
                            <Controller
                                name="from"
                                control={control}
                                render={({field, fieldState}) => (
                                    <div className="auth-field">
                                        <label htmlFor="stats-from">Du</label>
                                        <Calendar
                                            inputId="stats-from"
                                            value={field.value}
                                            onBlur={field.onBlur}
                                            onChange={(event) =>
                                                field.onChange(event.value instanceof Date ? event.value : field.value)
                                            }
                                            showIcon
                                            showTime
                                            hourFormat="24"
                                            dateFormat="dd/mm/yy"
                                            inputClassName={fieldState.invalid ? 'p-invalid' : undefined}
                                        />
                                        {fieldState.error?.message ? (
                                            <small className="p-error">{fieldState.error.message}</small>
                                        ) : null}
                                    </div>
                                )}
                            />

                            <Controller
                                name="to"
                                control={control}
                                render={({field, fieldState}) => (
                                    <div className="auth-field">
                                        <label htmlFor="stats-to">Au</label>
                                        <Calendar
                                            inputId="stats-to"
                                            value={field.value}
                                            onBlur={field.onBlur}
                                            onChange={(event) =>
                                                field.onChange(event.value instanceof Date ? event.value : field.value)
                                            }
                                            showIcon
                                            showTime
                                            hourFormat="24"
                                            dateFormat="dd/mm/yy"
                                            inputClassName={fieldState.invalid ? 'p-invalid' : undefined}
                                        />
                                        {fieldState.error?.message ? (
                                            <small className="p-error">{fieldState.error.message}</small>
                                        ) : null}
                                    </div>
                                )}
                            />

                            <Controller
                                name="granularity"
                                control={control}
                                render={({field}) => (
                                    <div className="auth-field">
                                        <label>Granularite</label>
                                        <SelectButton
                                            value={field.value}
                                            options={granularityOptions}
                                            optionLabel="label"
                                            allowEmpty={false}
                                            onChange={(event) => field.onChange(event.value as StatsGranularity)}
                                        />
                                    </div>
                                )}
                            />

                            <Controller
                                name="top"
                                control={control}
                                render={({field, fieldState}) => (
                                    <div className="auth-field">
                                        <label htmlFor="stats-top">Top N</label>
                                        <InputNumber
                                            inputId="stats-top"
                                            value={field.value}
                                            onBlur={field.onBlur}
                                            onValueChange={(event) => field.onChange(event.value ?? 10)}
                                            min={1}
                                            max={100}
                                            useGrouping={false}
                                            inputClassName={fieldState.invalid ? 'p-invalid' : undefined}
                                        />
                                        {fieldState.error?.message ? (
                                            <small className="p-error">{fieldState.error.message}</small>
                                        ) : null}
                                    </div>
                                )}
                            />

                            <Controller
                                name="includeConcerts"
                                control={control}
                                render={({field}) => (
                                    <div className="organizer-filter-toggle">
                                        <InputSwitch
                                            checked={field.value}
                                            onChange={(event) => field.onChange(Boolean(event.value))}
                                        />
                                        <span>Inclure details concerts</span>
                                    </div>
                                )}
                            />
                        </div>

                        <div className="organizer-filter-actions">
                            <Button
                                type="submit"
                                label="Appliquer"
                                icon="pi pi-filter"
                                loading={isSubmitting || isLoading}
                            />
                            <Button
                                type="button"
                                label="Reinitialiser"
                                icon="pi pi-refresh"
                                severity="secondary"
                                outlined
                                onClick={resetFilters}
                            />
                        </div>
                    </form>
                </Card>

                {apiError ? <Message severity="warn" text={`Erreur API stats: ${apiError}`}/> : null}
                {import.meta.env.DEV && apiDebugDetails ? (
                    <pre className="organizer-debug-block">{apiDebugDetails}</pre>
                ) : null}

                {isLoading && !stats ? (
                    <Card>
                        <div className="stack">
                            <Skeleton height="2rem" width="12rem"/>
                            <Skeleton height="1rem" width="100%"/>
                            <Skeleton height="1rem" width="100%"/>
                            <Skeleton height="1rem" width="80%"/>
                        </div>
                    </Card>
                ) : null}

                {stats ? (
                    <>
                        <Card className="organizer-meta-card">
                            <p className="organizer-small-muted">
                                Ceci est un aperçu de vos concerts qui se sont déroulés ou qui se déouleront selon le
                                filtre suivant:
                            </p>
                            <p className="organizer-small-muted">
                                Periode: {dateTimeFormatter.format(new Date(stats.period.from))} -{' '}
                                {dateTimeFormatter.format(new Date(stats.period.to))} | Granularité:{' '}
                                {stats.period.granularity} | Top: {stats.period.top}
                            </p>
                        </Card>

                        <section className="organizer-kpi-grid">
                            {kpis.map((kpi) => (
                                <Card key={kpi.label} className="organizer-kpi-card">
                                    <div className="organizer-kpi-head">
                                        <i className={kpi.icon}/>
                                        <p className="organizer-kpi-label">{kpi.label}</p>
                                    </div>
                                    <h3 className="organizer-kpi-value">{kpi.value}</h3>
                                </Card>
                            ))}
                        </section>

                        <Card title="Evolution vs periode precedente">
                            <div className="organizer-delta-row">
                                <Tag
                                    value={`Concerts: ${formatPercent(stats.overviewVsPreviousPeriod.concertsDeltaPct)}`}
                                    severity={deltaSeverity(stats.overviewVsPreviousPeriod.concertsDeltaPct)}
                                />
                                <Tag
                                    value={`Billets vendus: ${formatPercent(stats.overviewVsPreviousPeriod.soldTicketsDeltaPct)}`}
                                    severity={deltaSeverity(stats.overviewVsPreviousPeriod.soldTicketsDeltaPct)}
                                />
                                <Tag
                                    value={`Revenus: ${formatPercent(stats.overviewVsPreviousPeriod.revenueDeltaPct)}`}
                                    severity={deltaSeverity(stats.overviewVsPreviousPeriod.revenueDeltaPct)}
                                />
                                <Tag
                                    value={`Sell-through: ${formatPercent(stats.overviewVsPreviousPeriod.sellThroughDeltaPct)}`}
                                    severity={deltaSeverity(stats.overviewVsPreviousPeriod.sellThroughDeltaPct)}
                                />
                            </div>
                        </Card>

                        <div className="grid-12">
                            <div className="col-12">
                                <Card title="Par statut" className="organizer-breakdown-card">
                                    {renderBreakdownTable(stats.statusBreakdown)}
                                </Card>
                            </div>
                            <div className="col-12">
                                <Card title="Par ville" className="organizer-breakdown-card">
                                    {renderBreakdownTable(stats.cityBreakdown)}
                                </Card>
                            </div>
                            <div className="col-12">
                                <Card title="Par lieu" className="organizer-breakdown-card">
                                    {renderBreakdownTable(stats.placeBreakdown)}
                                </Card>
                            </div>
                        </div>

                        <Card title="Chronologie" className="organizer-timeline-card">
                            <DataTable
                                value={stats.timeline}
                                size="small"
                                stripedRows
                                emptyMessage="Aucune donnée trouvée"
                                paginator
                                rows={5}
                                rowsPerPageOptions={rowsPerPageOptions}
                            >
                                <Column field="bucketLabel" header="Periode" sortable/>
                                <Column
                                    field="concertsCreated"
                                    header="Concerts"
                                    sortable
                                    body={(row: OrganizerStatsTimelineRowDto) =>
                                        numberFormatter.format(row.concertsCreated)
                                    }
                                />
                                <Column
                                    field="ticketQuantity"
                                    header="Billets total"
                                    sortable
                                    body={(row: OrganizerStatsTimelineRowDto) =>
                                        numberFormatter.format(row.ticketQuantity)
                                    }
                                />
                                <Column
                                    field="ticketSold"
                                    header="Billets vendus"
                                    sortable
                                    body={(row: OrganizerStatsTimelineRowDto) =>
                                        numberFormatter.format(row.ticketSold)
                                    }
                                />
                                <Column
                                    field="revenueGross"
                                    header="CA brut"
                                    sortable
                                    body={(row: OrganizerStatsTimelineRowDto) =>
                                        currencyFormatter.format(row.revenueGross)
                                    }
                                />
                            </DataTable>
                        </Card>

                        <Card title="Classement" className="organizer-ranking-card">
                            <TabView>
                                <TabPanel header="Top revenus">
                                    {renderRankingTable(stats.rankings.topByRevenue)}
                                </TabPanel>
                                <TabPanel header="Top sell-through">
                                    {renderRankingTable(stats.rankings.topBySellThrough)}
                                </TabPanel>
                                <TabPanel header="Top billets vendus">
                                    {renderRankingTable(stats.rankings.topByTicketsSold)}
                                </TabPanel>
                                <TabPanel header="Plus faibles sell-through">
                                    {renderRankingTable(stats.rankings.worstBySellThrough)}
                                </TabPanel>
                            </TabView>
                        </Card>

                        {stats.period.includeConcerts ? (
                            <Card title="Concerts (detail)" className="organizer-concerts-card">
                                <DataTable
                                    value={stats.concerts}
                                    size="small"
                                    stripedRows
                                    showGridlines
                                    paginator
                                    rows={10}
                                    emptyMessage="Aucune donnée trouvée"
                                    rowsPerPageOptions={rowsPerPageOptions}
                                >
                                    <Column field="concertTitle" header="Concert" sortable/>
                                    <Column
                                        field="concertArtist"
                                        header="Artiste"
                                        sortable
                                        body={(row: { concertArtist?: string | null }) => row.concertArtist ?? 'N/A'}
                                    />
                                    <Column
                                        field="concertDate"
                                        header="Date concert"
                                        sortable
                                        body={(row: { concertDate: string }) =>
                                            dateTimeFormatter.format(new Date(row.concertDate))
                                        }
                                    />
                                    <Column
                                        field="concertStatus"
                                        header="Statut"
                                        sortable
                                        body={(row: { concertStatus: string }) => (
                                            <Tag value={row.concertStatus}
                                                 severity={statusSeverity(row.concertStatus)}/>
                                        )}
                                    />
                                    <Column
                                        header="Lieu"
                                        sortable
                                        body={(row: { placeName: string; placeCity: string }) =>
                                            `${row.placeName} (${row.placeCity})`
                                        }
                                    />
                                    <Column
                                        header="Vendus / Total"
                                        body={(row: { ticketSold: number; ticketQuantity: number }) =>
                                            `${numberFormatter.format(row.ticketSold)} / ${numberFormatter.format(row.ticketQuantity)}`
                                        }
                                    />
                                    <Column
                                        field="sellThroughRatePct"
                                        header="Sell-through"
                                        sortable
                                        body={(row: {
                                            sellThroughRatePct: number
                                        }) => formatPercent(row.sellThroughRatePct)}
                                    />
                                    <Column
                                        field="ticketUnitPrice"
                                        header="Prix billet"
                                        sortable
                                        body={(row: { ticketUnitPrice: number }) =>
                                            currencyFormatter.format(row.ticketUnitPrice)
                                        }
                                    />
                                    <Column
                                        field="grossRevenue"
                                        header="CA brut"
                                        sortable
                                        body={(row: {
                                            grossRevenue: number
                                        }) => currencyFormatter.format(row.grossRevenue)}
                                    />
                                </DataTable>
                            </Card>
                        ) : null}
                    </>
                ) : null}
            </div>
        </PageContainer>
    )
}
