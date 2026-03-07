function parseErrorMessage(error: unknown) {
  return (error as Error).message || (error as any).error || JSON.stringify(error)
}

export default parseErrorMessage
