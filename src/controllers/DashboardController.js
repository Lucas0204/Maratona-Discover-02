const Job = require('../model/Job')
const Profile = require('../model/Profile')
const JobUtils = require('../utils/JobUtils')

module.exports = {

    index: async (req, res) => {
    
        const jobs = await Job.get()
        const profile = await Profile.get()

        let statusCount = {
            progress: 0,
            done: 0,
            total: jobs.length
        }

        let jobTotalHours = 0
    
        const updatedJobs = jobs.map(job => {
    
            const remaining = JobUtils.remainingDays(job)
            const budget = JobUtils.calculateBudget(job, profile['value-hour'])
            const status = remaining <= 0 ? 'done' : 'progress'

            statusCount[status] += 1

            jobTotalHours = status == 'progress' ? jobTotalHours + Number(job['daily-hours']) : jobTotalHours
    
            return {
                ...job,
                remaining,
                budget,
                status
            }
    
        })

        const freeHours = profile['hours-per-day'] - jobTotalHours
        
        return res.render('index', { profile, jobs: updatedJobs, statusCount, freeHours })
    }
}
