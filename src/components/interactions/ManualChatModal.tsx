import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, Send, User, Bot, UserCog } from 'lucide-react'
import useMainStore from '@/stores/useMainStore'
import { Interaction } from '@/types'
import { cn } from '@/lib/utils'

export function ManualChatModal({ interaction }: { interaction: Interaction }) {
  const { sendManualMessage, clients } = useMainStore()
  const [message, setMessage] = useState('')
  const [open, setOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const clientName = interaction.clientId
    ? clients.find((c) => c.id === interaction.clientId)?.name
    : interaction.phone

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [open, interaction.chatHistory])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    sendManualMessage(interaction.id, message)
    setMessage('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant={interaction.status === 'aguardando_atendimento_humano' ? 'default' : 'outline'}
          className={cn(
            'gap-1',
            interaction.status === 'aguardando_atendimento_humano' &&
              'bg-red-600 hover:bg-red-700 text-white animate-pulse',
          )}
        >
          <MessageSquare className="h-4 w-4" />
          {interaction.status === 'aguardando_atendimento_humano'
            ? 'Atender Agora'
            : 'Ver Conversa'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b bg-muted/30">
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            Chat com {clientName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 p-4 overflow-y-auto" ref={scrollRef}>
          <div className="space-y-4">
            {interaction.chatHistory?.map((msg) => {
              const isUser = msg.role === 'user'
              const isSystem = msg.role === 'system'

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <span className="bg-muted px-3 py-1 rounded-full text-[10px] font-medium text-muted-foreground">
                      {msg.text}
                    </span>
                  </div>
                )
              }

              return (
                <div
                  key={msg.id}
                  className={cn('flex w-full', isUser ? 'justify-start' : 'justify-end')}
                >
                  <div
                    className={cn(
                      'max-w-[75%] rounded-lg p-3 text-sm shadow-sm',
                      isUser ? 'bg-muted text-foreground' : 'bg-primary text-primary-foreground',
                      msg.role === 'human' && 'bg-blue-600 text-white',
                    )}
                  >
                    {!isUser && (
                      <div className="flex items-center gap-1 mb-1 text-[10px] opacity-80 font-medium">
                        {msg.role === 'ai' ? (
                          <>
                            <Bot className="h-3 w-3" /> Assistente Virtual
                          </>
                        ) : (
                          <>
                            <UserCog className="h-3 w-3" /> Atendente (Você)
                          </>
                        )}
                      </div>
                    )}
                    {msg.hasMedia && (
                      <div className="mb-2 p-2 bg-black/10 rounded flex items-center gap-2">
                        <span className="text-xs">📎 Anexo Recebido</span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    <div className="text-[10px] text-right mt-1 opacity-60">
                      {new Intl.DateTimeFormat('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      }).format(new Date(msg.timestamp))}
                    </div>
                  </div>
                </div>
              )
            })}
            {!interaction.chatHistory?.length && (
              <div className="text-center text-muted-foreground text-sm py-10">
                Nenhum histórico disponível para esta conversa.
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSend} className="p-3 border-t bg-background flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem para assumir o atendimento..."
            className="flex-1 bg-muted/50 focus-visible:ring-1"
          />
          <Button type="submit" size="icon" disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
