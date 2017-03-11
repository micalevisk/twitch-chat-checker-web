![Codeship Status](https://app.codeship.com/projects/e217ac60-e8af-0134-8f9f-56b0afe50fec/status?branch=master)
[![Heroku Status](http://heroku-badge.herokuapp.com/?app=twitch-chat-checker)](https://twitch-chat-checker.herokuapp.com/)
[![Dependency Status](https://dependencyci.com/github/micalevisk/twitch-chat-checker-web/badge)](https://dependencyci.com/github/micalevisk/twitch-chat-checker-web)

# Twitch Chat Checker (web version)
demo: [https://twitch-chat-checker.herokuapp.com/](https://twitch-chat-checker.herokuapp.com/)



# API usage
> URL [twitch-chat-checker.herokuapp.com/](https://twitch-chat-checker.herokuapp.com/)~

| Endpoint            | Description |
| ------------------- | ----------- |
| [GET /:username/on/:channel]() | Get information about `username` & `channel` chat |

<h2>Query parameter: `fields`</h2>
<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
	<tr>
            <td align="center"><code>_extra</code>
            <td>To show only extra informations.</td>
        </tr>
	<tr>
            <td align="center"><code>data</code>
            <td>To show only real Twitch TV API request.</td>
        </tr>
    </tbody>
</table>


<h3>Example Request</h3>
```bash
curl -X GET https:/twitch-chat-checker.herokuapp.com/kempzbr/on/mydopefish
```

<h3>Example Response</h3>
```json
{
	"_extra": {
		"solicitated_at": "2017-03-11T18:38:21.831Z",
		"from": "kempzbr",
		"to": "mydopefish",
		"online": true,
		"type": "viewer"
	},
  "chatter_count": 1,
  "chatters": {
		"moderators": [],
		"staff": [],
		"admins": [],
		"global_mods": [],
		"viewers": [
			"kempzbr"
		]
  }
}
```