import detectEthereumProvider from '@metamask/detect-provider'
import Calendar from 'components/calendar'
import { useEffect, useState } from 'react'

export default function App() {
  const [account, setAccount] = useState(null)

  useEffect(() => {
    checkAccountConnected()
  }, [])

  const checkAccountConnected = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const provider: any = await detectEthereumProvider()
    const accounts = await provider.request({ method: 'eth_accounts' })

    if (accounts.length > 0) {
      setAccount(accounts[0])
    } else {
      console.log('Not authorized  account found')
    }
  }

  const handleConnectWallet = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const provider: any = await detectEthereumProvider()

      if (provider) {
        // returns an array of accounts
        const accounts = await provider.request({
          method: 'eth_requestAccounts'
        })
        console.log('after provider')

        if (accounts.length > 0) {
          setAccount(accounts[0])
        } else {
          alert('No account found')
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="bg-gray-900">
      <div className="mx-auto h-full max-w-screen-xl py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-semiBold text-base uppercase tracking-wide text-white">
            Welcome to
          </h2>
          <p className="my-3 text-4xl font-bold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Calend3
          </p>
          <p className="mb-6 text-xl text-gray-100">
            A web3 appointment scheduling.
          </p>
          {!account && (
            <button
              className="rounded bg-white p-2"
              onClick={handleConnectWallet}
            >
              Connect Wallet
            </button>
          )}
          {account && <Calendar account={account} />}
        </div>
      </div>
    </div>
  )
}
