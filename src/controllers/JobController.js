const Profile = require('../model/Profile')
const Job = require('../model/Job')
const JobUtils = require('../utils/JobUtils')

module.exports = {

    create: (req, res) => {
        return res.render('job')
    },

    saveJob: async (req, res) => {

        await Job.addJob({
            name: req.body.name,
            "daily-hours": req.body['daily-hours'],
            "total-hours": req.body['total-hours'],
            createdAt: Date.now()
        })

        return res.redirect('/')
    },

    show: async (req, res) => {

        const profile = await Profile.get()
        const jobs = await Job.get()
        const jobId = req.params.id

        const job = jobs.find(job => job.id == jobId)

        if (!job) {
            return res.send('Job not found!')
        }

        job.budget = JobUtils.calculateBudget(job, profile['value-hour'])

        return res.render('job-edit', { job })
    },

    update: async (req, res) => {

        const jobId = req.params.id

        const updatedJobs = {
            name: req.body.name,
            "daily-hours": req.body['daily-hours'],
            "total-hours": req.body['total-hours']
        }

        await Job.update(updatedJobs, jobId)

        return res.redirect('/job/' + jobId)
    },

    delete: async (req, res) => {

        const jobId = req.params.id

        await Job.delete(jobId)

        return res.redirect('/')
    }
}
