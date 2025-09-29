import { createFileRoute } from '@tanstack/react-router'

import Forum from '@/pages/Forum'


export const Route = createFileRoute('/forum')({
  component: Forum,
})

