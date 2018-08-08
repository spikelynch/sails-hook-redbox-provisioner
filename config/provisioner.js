module.exports = {
	provisioner: {
		stores: {
			data: '/opt/store/data',
			staging: '/opt/store/staging',
			public: '/opt/store/public'
		},
		locations: {
			dataRecord: {
				draft: 'data'
			},
			dataPublication: {
				draft: "staging",
				queued: "staging",
				embargoed: "staging",
				reviewing: "staging",
				publishing: "public",
				published: "public",
				retired: "staging"
			}
		}
	}
}
