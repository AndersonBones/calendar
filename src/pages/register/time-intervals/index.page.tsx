import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { Checkbox } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { Container, Header } from '../styles'
import { IntervalBox, IntervalDay, IntervalInputs, IntervalItem, IntervalsContainer } from './styles'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { getWeekDays } from '@/utils/get-week-days'
import { zodResolver } from '@hookform/resolvers/zod'
import { convertTimeStrtoMinutes } from '@/utils/convert-time'
import { api } from '@/lib/axios'




const timeIntervalsFormSchema = z.object({ // form validação
    // input data
    intervals: z.array(z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string()
    }))
        // output data
        .length(7)
        .transform((intervals) => intervals.filter((interval) => interval.enabled == true))
        .refine((intervals) => intervals.length > 0, { message: 'Selecione pelo menos um dia da semana!' }) // não permite um array vazio
        .transform((intervals)=> intervals.map(interval=>{
            return {
                weekDay:interval.weekDay,
                startTimeInMinutes:convertTimeStrtoMinutes(interval.startTime),
                endTimeInMinutes:convertTimeStrtoMinutes(interval.endTime),
            }
        }))
        .refine(intervals=>{
            return intervals.every(interval =>interval.endTimeInMinutes - interval.startTimeInMinutes >= interval.startTimeInMinutes)
        },{message:"O horário de término deve ser maior que o horário de início"})
})

type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema> // infere a tipagem da validação
type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema> // infere a tipagem da validação

export default function TimeInterval() {

    // defaultValues define os valores default para o intervals
    // formState: estado de submitting e msg de erros

    const { formState, handleSubmit, control, register, watch, formState: { isSubmitting, errors } } = useForm<TimeIntervalsFormInput>({
        resolver: zodResolver(timeIntervalsFormSchema),
        defaultValues: {
            intervals: [
                { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
                { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
                { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
            ]
        }
    })

    // obtemos os dados de intervals usando field
    const { fields } = useFieldArray({ // controled useForm
        name: 'intervals', // nome do dado
        control // control do formState o qual esta o intervals
    })

    const intervals = watch("intervals") // monitora qualquer modificação no intervals

    async function handleSetTimeIntervals(data: any) { // imprime os dados de intervals
        const {intervals} = data as TimeIntervalsFormOutput
        
        const time_data = await api.post('/users/time-intervals', {intervals})


        const {session} = time_data.data
        console.log(session)
    }



    const weekDays = getWeekDays() // obtem a ordem dos dias da semana


    return (
        <Container>
            <Header>
                <Heading as="strong">Quase lá!</Heading>
                <Text>
                    Defina o intervalo de horários que você está disponível em cada dia da semana.
                </Text>

                <MultiStep size={4} currentStep={3} />
            </Header>

            {/* faz um map no fieds, onde estão os dados do intervals */}
            <IntervalBox as='form' onSubmit={handleSubmit(handleSetTimeIntervals)}>
                {fields.map((item, index) => {
                    return (
                        <IntervalsContainer key={item.id}>
                            <IntervalItem>
                                <IntervalDay>
                                    {/* name: campo que será modificado*/}
                                    <Controller 
                                        name={`intervals.${index}.enabled`}
                                        control={control}
                                        render={({ field }) => {
                                            return (
                                                <Checkbox
                                                    onCheckedChange={(checked: boolean) => {
                                                        field.onChange(checked == true)
                                                    }}
                                                    checked={field.value}
                                                />
                                            )
                                        }}
                                    />
                                    <Text>{weekDays[item.weekDay]}</Text>
                                </IntervalDay>

                                <IntervalInputs>
                                    <TextInput
                                        disabled={intervals[index].enabled == false}
                                        size='sm'
                                        type="time"
                                        step={60}
                                        {...register(`intervals.${index}.startTime`)}
                                    >

                                    </TextInput>

                                    <TextInput
                                        disabled={intervals[index].enabled == false}
                                        size='sm'
                                        type="time"
                                        step={60}
                                        {...register(`intervals.${index}.endTime`)}
                                    >

                                    </TextInput>

                                </IntervalInputs>
                            </IntervalItem>


                        </IntervalsContainer>
                    )

                })}

                {errors.intervals && (
                    <span className="text-rose-500 dark:text-rose-400 ">
                        {errors?.intervals?.root?.message}
                    </span>
                )}

                <Button className="mt-5" type="submit" disabled={isSubmitting} variant={"secondary"}>Próximo passo <ArrowRight /></Button>
            </IntervalBox>


        </Container>
    )
}
