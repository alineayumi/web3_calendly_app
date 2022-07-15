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
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import CircularProgress from '@mui/material/CircularProgress'
import { ethers } from 'ethers'
import abi from '../abis/Calend3.json'
import { useState, useEffect } from 'react'
import { Box, Button, Slider } from '@material-ui/core'
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest'

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
const contractAbi = abi.abi
const provider = new ethers.providers.Web3Provider(window.ethereum!)
const contract = new ethers.Contract(
  contractAddress,
  contractAbi,
  provider.getSigner()
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Calendar({ account }: { account: any }) {
  // state for admin and rate
  const [isAdmin, setIsAdmin] = useState(false)
  const [rate, setRate] = useState('')
  const [appointments, setAppointments] = useState<
    { title: string; startDate: Date; endDate: Date }[]
  >([])

  const [showDialog, setShowDialog] = useState(false)
  const [showSign, setShowSign] = useState(false)
  const [mined, setMined] = useState(false)
  const [transactionHash, setTransactionHash] = useState('')

  useEffect(() => {
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getData = async () => {
    const owner = await contract.owner()
    setIsAdmin(owner.toUpperCase() === account.toUpperCase())

    const _rate = await contract.getRate()
    setRate(ethers.utils.formatEther(_rate.toString()))

    const appointmentData = await contract.getAppointments()
    transformAppointmentData(appointmentData)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformAppointmentData = (appointmentData: any[]) => {
    const data: { title: string; startDate: Date; endDate: Date }[] = []
    appointmentData.forEach((appointment) => {
      data.push({
        title: appointment.title,
        startDate: new Date(appointment.startTime * 1000),
        endDate: new Date(appointment.endTime * 1000)
      })
    })
    setAppointments(data)
  }

  const saveAppointment = async (data: ChangeSet) => {
    const appointment = data.added
    if (appointment !== undefined) {
      const title = appointment.title
      const startTime = appointment.startDate.getTime() / 1000
      const endTime = appointment.endDate.getTime() / 1000

      setShowSign(true)
      setShowDialog(true)
      setMined(false)

      try {
        const cost = (((endTime - startTime) / 60) * (Number(rate) * 100)) / 100
        const msg = { value: ethers.utils.parseEther(cost.toString()) }
        const transaction = await contract.createAppointment(
          title,
          startTime,
          endTime,
          msg
        )

        setShowSign(false)

        await transaction.wait()

        setMined(true)
        setTransactionHash(transaction.hash)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const Admin = () => {
    const handleSliderChange = (
      event: React.ChangeEvent<Record<string, unknown>>,
      newValue: number | number[]
    ) => {
      setRate(newValue.toString())
    }

    const saveRate = async () => {
      await contract.setRate(ethers.utils.parseEther(rate.toString()))
    }

    const marks = [
      {
        value: 0.0,
        label: 'Free'
      },
      {
        value: 0.02,
        label: '0.02 ETH/min'
      },
      {
        value: 0.04,
        label: '0.04 ETH/min'
      },
      {
        value: 0.06,
        label: '0.06 ETH/min'
      },
      {
        value: 0.08,
        label: '0.08 ETH/min'
      },
      {
        value: 0.1,
        label: 'Expensive'
      }
    ]

    return (
      <Box className="my-4 rounded bg-white py-4 px-12 text-gray-900">
        <h3 className="font-bold">SET YOUR MINUTELY RATE</h3>
        <Slider
          key={'slider'}
          defaultValue={parseFloat(rate) || 0}
          step={0.001}
          min={0}
          max={0.1}
          valueLabelDisplay="auto"
          onChangeCommitted={handleSliderChange}
          marks={marks}
        />
        <br />
        <br />
        <Button
          onClick={saveRate}
          variant="contained"
          className="mb-3 bg-gray-900 text-white"
        >
          <SettingsSuggestIcon />
          <p className="ml-2">save configuration</p>
        </Button>
      </Box>
    )
  }

  const ConfirmDialog = () => {
    return (
      <Dialog
        open={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          {mined && 'Appointment Confirmed'}
          {!mined && !showSign && 'Confirming your appointment ...'}
          {!mined && showSign && 'Please sign to confirm'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-title">
            <div className="px-4 pb-4 text-left">
              {mined && (
                <div>
                  Your appointment has been confirmed and is on the blockchain.
                  <br />
                  <br />
                  <a
                    target="_blank"
                    href={`https://goerli.etherscan.io/tx/${transactionHash}`}
                    rel="noreferrer"
                  >
                    View on Etherscan
                  </a>
                </div>
              )}
              {!mined && !showSign && (
                <div>
                  <p>
                    Please wait while we confirm your appointment on the
                    blockchain....
                  </p>
                </div>
              )}
              {!mined && showSign && (
                <div>
                  <p>
                    Please sign the transaction to confirm your appointment.
                  </p>
                </div>
              )}
            </div>
          </DialogContentText>
        </DialogContent>

        <div style={{ textAlign: 'center', paddingBottom: '30px' }}>
          {!mined && <CircularProgress />}
        </div>
        <DialogActions>
          {mined && (
            <Button
              onClick={() => {
                setShowDialog(false)
                getData()
              }}
            >
              Close
            </Button>
          )}
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <div>
      {isAdmin && <Admin />}
      <Paper className="p-4">
        <Scheduler data={appointments}>
          <ViewState />
          <EditingState onCommitChanges={saveAppointment} />
          <IntegratedEditing />
          <WeekView startDayHour={9} endDayHour={19} />
          <Appointments />
          <AppointmentForm />
        </Scheduler>
      </Paper>
      {showDialog && <ConfirmDialog />}
    </div>
  )
}
