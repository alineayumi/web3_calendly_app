import {
  ViewState,
  EditingState,
  IntegratedEditing,
  ChangeSet
} from '@devexpress/dx-react-scheduler'
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentForm
} from '@devexpress/dx-react-scheduler-material-ui'
import Paper from '@mui/material/Paper'

export default function Calendar() {
  const schedulerData = [
    {
      startDate: '2022-07-10T09:45',
      endDate: '2022-07-10T11:00',
      title: 'Meeting'
    },
    {
      startDate: '2022-07-10T12:00',
      endDate: '2022-07-10T13:30',
      title: 'Go to a gym'
    }
  ]

  const saveAppointment = (data: ChangeSet) => {
    console.log('committing changes')
    console.log(data)
  }

  return (
    <Paper className="p-4">
      <Scheduler data={schedulerData}>
        <ViewState />
        <EditingState onCommitChanges={saveAppointment} />
        <IntegratedEditing />
        <WeekView startDayHour={9} endDayHour={19} />
        <Appointments />
        <AppointmentForm />
      </Scheduler>
    </Paper>
  )
}
