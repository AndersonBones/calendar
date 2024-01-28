import { CaretLeft, CaretRight } from "phosphor-react";
import { CalendarActions, CalendarBody, CalendarContainer, CalendarDay, CalendarHeader, CalendarTitle } from "./styles";
import { getWeekDays } from "@/utils/get-week-days";
import { useMemo, useState } from "react";
import dayjs from 'dayjs'


interface CalendarWeek{
    week:number,
    days: Array<{
        date:dayjs.Dayjs,
        disabled:boolean
    }>
}

type CalendarWeeks = CalendarWeek[]


interface CalendarProps{
    selectedDate?:Date | null
    onDateSelected:(date:Date) => void
}
export function Calendar({selectedDate, onDateSelected}:CalendarProps){
    const [currentDate, setCurrentDate] = useState(()=>{
        return dayjs().set('date', 1) // currentDate se torna um objeto dayjs por padrão
    })
    
    function handlePreviousMonth(){ // mês anterior
        const previousMonthDate = currentDate.subtract(1, 'month') // subtrai um mês da data atual
        setCurrentDate(previousMonthDate)
    }

    function handleNextMonth(){ // proximo mês
        const nextMonthDate = currentDate.add(1, 'month') // adiciona mais um mês a data atual
        setCurrentDate(nextMonthDate)
    }

    
    const currentMonth = currentDate.format("MMMM") // get month
    const currentYear = currentDate.format("YYYY") // get year

    const calendarWeeks = useMemo(()=>{

        const daysInMonthArray = Array.from({ // retorna os dias do mês atual
            length:currentDate.daysInMonth(), // total de dias do mês atual
        }).map((_,index)=>{ // loop no total de dias 
            return currentDate.set('date',index+1) // retorna um objeto dayjs com informações dos dias do mês
        })

        const firstWeekDay = currentDate.get('day') // primeiro dia da semana em numero (de 0 a 6)

       
        const previousMonthFillArray = Array.from({ // obtem os ultimos dias do mes anterior
            length:firstWeekDay, // firstWeekDay representa o total de dias a serem obtidos do mes anterior
        }).map((_, index)=>{
            return currentDate.subtract(index + 1, 'day') // subtrai dias da semana apartir do dia atual 
        }).reverse()

        
        const lastDayInCurrentMonth = currentDate.set('date', currentDate.daysInMonth()) // ultimo dia do mês
        const lastWeekDay = lastDayInCurrentMonth.get('day') // dia da semana do ultimo dia do mes
        
        const nextMonthFillArray = Array.from({ // retorna os proximos dias da semana apartir do ultimo dia do mês
            length:6 - lastWeekDay, // total de dias restantes da semana apartir do ultimo dia do mes
        }).map((_, index)=>{
            return lastDayInCurrentMonth.add(index +1, 'day') // incrementa os dias 
        })


        const calendarDays = [ // todos os dias do calendario
            ...previousMonthFillArray.map((date)=>{
                return {date, disabled: true}
            }), 
            ...daysInMonthArray.map((date)=>{
                return {date, disabled:date.endOf('day').isBefore(new Date())}
            }), 

            ...nextMonthFillArray.map((date)=>{
                return {date, disabled: true}
            })
        ]

      
        
        // separa o array em semanas, onde cada semana contém seus dias
        const calendarWeeks = calendarDays.reduce<CalendarWeeks>((weeks, _, index, original)=>{
            const isNewWeek = index % 7 == 0 // verifica index do dia do mes é divisivel por 7

            if(isNewWeek){ // a cada valor divisivel por 7, representa o dia de inicio de uma semana
                console.log(index)
                weeks.push({ // separa cada semana em um objeto
                    week:index / 7 + 1, // indice da semana
                    days: original.slice(index, index+7) // armazena os sete dias da semana apartir do primeiro dia da semana
                })                                      
            }

            return weeks // retorna array tratado
        }, [])
        return calendarWeeks

    },[currentDate])
   

    const weekdays = getWeekDays({short: true})
    return (
        <CalendarContainer>
            <CalendarHeader>
                <CalendarTitle>
                    {currentMonth} <span>{currentYear}</span>
                </CalendarTitle>

                <CalendarActions>
                    <button onClick={handlePreviousMonth} title="Previous month">
                        <CaretLeft/>
                    </button>

                    <button onClick={handleNextMonth} title="Next month">
                        <CaretRight/>
                    </button>
                </CalendarActions>
            </CalendarHeader>

            <CalendarBody>
                <thead>
                    <tr>
                        {weekdays.map(day=>{
                            return(<th key={day}>{day}.</th>)
                        })}
                    </tr>
                </thead>

                <tbody>
                    {calendarWeeks.map(({week, days})=>{
                        return (
                            <tr key={week}>
                                {days.map(({date, disabled})=>{
                                    return (
                                        <td key={date.toString()}>
                                            <CalendarDay onClick={()=> onDateSelected(date.toDate())} disabled={disabled}>
                                                {date.get('date')}
                                            </CalendarDay>
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                    
                </tbody>
            </CalendarBody>
        </CalendarContainer>
    )
}