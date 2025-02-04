import { LOCAL_SUPPORTED } from "@/utils/local"
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Label,
  Radio,
  RadioGroup,
  Transition,
  TransitionChild,
} from "@headlessui/react"
import { CheckIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useCallback,
  useState,
} from "react"

interface DownloadModalProps {
  isShow: boolean
  setIsShow: Dispatch<SetStateAction<boolean>>
}

export function DownloadModal({ isShow, setIsShow }: DownloadModalProps) {
  let [local, setLocal] = useState<LOCAL_SUPPORTED>(LOCAL_SUPPORTED.ENGLISH)

  const handleDialogClose = useCallback(() => setIsShow(false), [setIsShow])

  return (
    <Transition
      appear
      show={isShow}
      as={Fragment}
    >
      <Dialog
        as="div"
        className="relative z-10"
        onClose={handleDialogClose}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md overflow-hidden rounded-2xl bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg leading-6 font-medium text-blue-300"
                >
                  Choose language
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-blue-100">
                    My curriculum vitae will be translated in the language you
                    choose
                  </p>
                </div>
                <div className="w-full px-4 py-8">
                  <div className="mx-auto w-full max-w-md">
                    <RadioGroup
                      value={local}
                      onChange={setLocal}
                    >
                      <div className="space-y-2">
                        {Object.values(LOCAL_SUPPORTED).map(
                          (local_supported) => {
                            return (
                              <Radio
                                key={local_supported}
                                value={local_supported}
                                className={({ checked }) =>
                                  ` ${checked ? "bg-primary-600" : "bg-slate-800"} active:ring-primary-900 active:ring-opacity-60 active:ring-offset-primary-300 relative flex cursor-pointer rounded-lg px-5 py-4 focus:outline-hidden active:ring-2 active:ring-offset-2`
                                }
                              >
                                {({ checked }) => (
                                  <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center">
                                      <div className="text-sm">
                                        <Label
                                          as="p"
                                          className={`font-bold capitalize ${
                                            checked
                                              ? "text-blue-900"
                                              : "text-blue-100"
                                          }`}
                                        >
                                          {local_supported}
                                        </Label>
                                      </div>
                                    </div>
                                    {checked && (
                                      <div className="shrink-0 text-blue-900">
                                        <CheckIcon className="size-6" />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Radio>
                            )
                          },
                        )}
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="mt-4">
                  <Link href={`/api/download/curriculum?language=${local}`}>
                    <button
                      type="button"
                      className="bg-accent-200 hover:bg-accent-400 active:bg-accent-400 inline-flex justify-center rounded-md border border-transparent px-4 py-2 font-sans text-base font-bold text-blue-900 transition delay-75 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-105"
                    >
                      Download
                    </button>
                  </Link>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
