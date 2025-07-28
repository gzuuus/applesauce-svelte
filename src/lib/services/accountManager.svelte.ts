import { AccountManager } from 'applesauce-accounts';
import { registerCommonAccountTypes } from 'applesauce-accounts/accounts';

// create an account manager instance
export const manager = new AccountManager();

export const activeAccount = manager.active$;
// register common account types
registerCommonAccountTypes(manager);

export const logout = () => {
	localStorage.removeItem('accounts');
	manager.clearActive();
};
