require('dotenv').config();

module.exports = {
    mindbody: {
        sourceCredentials: {
            SourceName: process.env.MINDBODY_SOURCE_CREDS_NAME,
            Password: process.env.MINDBODY_SOURCE_CREDS_PASS,
            SiteIDs: {
                int: [process.env.MINDBODY_SITE_ID]
            }
        },
        staffCredentials: {
            Username: process.env.MINDBODY_STAFF_CREDS_NAME,
            Password: process.env.MINDBODY_STAFF_CREDS_PASS,
            SiteIDs: {
                int: [process.env.MINDBODY_SITE_ID]
            }
        }
    },
    contentful: {
        space_id: process.env.CONTENTFUL_SPACE_ID,
        access_token: process.env.CONTENFUL_TOKEN
    },
	twitter: {
		consumer_key: process.env.TWITTER_CONSUMER_KEY,
		consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
		access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
		access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
	},
	instagram: {
		clientID: process.env.INSTA_CLIENT_ID,
		clientSecret: process.env.INSTA_CLIENT_SECRET,
		accessToken: process.env.INSTA_ACCESS_TOKEN
	}
}
