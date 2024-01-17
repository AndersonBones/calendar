export function convertTimeStrtoMinutes(timeStr:string){
    const [hours, minutes] = timeStr.split(':').map(Number)

    return hours * 60 + minutes
}