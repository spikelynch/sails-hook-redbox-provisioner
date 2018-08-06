module.exports = {
	provisioner: {
		stores: {
			data: './test/fixtures/data',
			staging: './test/fixtures/staging',
			public: './test/fixtures/public'
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
