const Profile = require('../model/Profile')

module.exports = {

    index: async (req, res) => {
        const profile = await Profile.get()
        return res.render('profile', { profile })
    },

    update: async (req, res) => {

        const data = req.body
        const weeksPerYear = 52
        const weeksPerMonth = (weeksPerYear - data['vacation-per-year']) / 12
        const weeksTotalHours = data['hours-per-day'] * data['days-per-week']
        const monthlyTotalHours = weeksTotalHours * weeksPerMonth

        const valueHour = data['monthly-budget'] / monthlyTotalHours

        const profile = await Profile.get()

        // Sempre pedir para o model alterar os dados
        // Não mexer nos dados em arquivos de controller
        await Profile.update({
            ...profile,
            ...req.body,
            "value-hour": valueHour
        })

        return res.redirect('/profile')
    }
}
