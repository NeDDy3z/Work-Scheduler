

const content = {
    "web": {
        "client_id": "1041203883981-7qm9ruu3aiaoofa607dvbicpmfqe06tq.apps.googleusercontent.com",
        "project_id": "work-scheduler-425410",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": "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",
        "redirect_uris": [
            "https://work-scheduler.up.railway.app/schedule"
        ],
        "javascript_origins": [
            "http://localhost:8080",
            "https://work-scheduler.up.railway.app:8080"
        ]
    }
};

const credentials = JSON.parse(content);

console.log(credentials);

