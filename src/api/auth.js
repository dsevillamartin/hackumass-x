import { account } from '.'

export const logout = () => account.deleteSession('current')
