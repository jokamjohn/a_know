import people from './people'

static const teams = { 
  feedback: {
    name: 'Feedback Team',
    description: 'Previously known as the Pulse team, the Feedback team mainly forcuses on relaying feedback from Partners and availing it to the authorized concerned parties for reflection and/or action',
    members: Object.values(people).filter(person => person.role.includes('Feedback'))
  },
  information: {
    name: 'Information Team',
    description: "Previously known as the Andela Information System (AIS) team, the Information team mainly forcuses on managing and maintaining Andela's sole source of truth, i.e. AIS",
    members: Object.values(people).filter(person => person.role.includes('Information'))
  }
}