// src/stores/transaction.js
import { defineStore } from 'pinia'
import * as transactionService from '@/services/transaction'

export const useTransactionStore = defineStore('transaction', {
    state: () => ({
        transactions: [],       // list of transactions
        selectedTransaction: null, // currently selected transaction
        loading: false,         // loading indicator
        error: null             // error message
    }),
    actions: {
        /**
         * Load all transactions
         * @returns {Promise<Array>}
         */
        async loadAllTransactions() {
            this.loading = true
            this.error = null
            try {
                this.transactions = await transactionService.getAllTransactions()
                return this.transactions
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },
        /**
         * Load a transaction by its ID
         * @param {number} id
         * @returns {Promise<Object|null>}
         */
        async loadTransactionById(id) {
            this.loading = true
            this.error = null
            try {
                const tx = await transactionService.getTransactionById(id)
                this.selectedTransaction = tx
                return tx
            } catch (e) {
                this.error = e.response?.data || e.message
                return null
            } finally {
                this.loading = false
            }
        },
        /**
         * Load transactions by user ID
         * @param {number} userId
         * @returns {Promise<Array>}
         */
        async loadTransactionsByUserId(userId) {
            this.loading = true
            this.error = null
            try {
                this.transactions = await transactionService.getTransactionsByUserId(userId)
                return this.transactions
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },
        /**
         * Load transactions by admin ID
         * @param {number} adminId
         * @returns {Promise<Array>}
         */
        async loadTransactionsByAdminId(adminId) {
            this.loading = true
            this.error = null
            try {
                this.transactions = await transactionService.getTransactionsByAdminId(adminId)
                return this.transactions
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },
        /**
         * Load transactions by admin and user IDs
         * @param {number} adminId
         * @param {number} userId
         * @returns {Promise<Array>}
         */
        async loadTransactionsByAdminUser(adminId, userId) {
            this.loading = true
            this.error = null
            try {
                this.transactions = await transactionService.getTransactionsByAdminUser(adminId, userId)
                return this.transactions
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },
        /**
         * Load transactions by date
         * @param {string} date  // ISO 8601 string
         * @returns {Promise<Array>}
         */
        async loadTransactionsByDate(date) {
            this.loading = true
            this.error = null
            try {
                this.transactions = await transactionService.getTransactionsByDate(date)
                return this.transactions
            } catch (e) {
                this.error = e.response?.data || e.message
                return []
            } finally {
                this.loading = false
            }
        },
        /**
         * Create a system transaction
         * @param {Object} txDto
         * @returns {Promise<Object|null>}
         */
        async createSystemTransaction(txDto) {
            this.loading = true
            this.error = null
            try {
                const tx = await transactionService.createSystemTransaction(txDto)
                this.transactions.push(tx)
                return tx
            } catch (e) {
                this.error = e.response?.data || e.message
                return null
            } finally {
                this.loading = false
            }
        },
        /**
         * Create a new transaction
         * @param {Object} txDto
         * @returns {Promise<Object|null>}
         */
        async createTransaction(txDto) {
            this.loading = true
            this.error = null
            try {
                const tx = await transactionService.createTransaction(txDto)
                this.transactions.push(tx)
                return tx
            } catch (e) {
                this.error = e.response?.data || e.message
                return null
            } finally {
                this.loading = false
            }
        },
        /**
         * Delete a transaction by its ID
         * @param {number} id
         */
        async deleteTransaction(id) {
            this.loading = true
            this.error = null
            try {
                await transactionService.deleteTransaction(id)
                this.transactions = this.transactions.filter(tx => tx.id !== id)
            } catch (e) {
                this.error = e.response?.data || e.message
            } finally {
                this.loading = false
            }
        }
    }
})
