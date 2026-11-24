# Comp3810 Group 28 Project
## 1. Project info
- Project name: 
- Description: 

## 2. Group info
- Group number: 28
- Members:
  - FANG Xifan, SID: 13562716
  - Ng Yin Ting, SID: 13882306
  - Fung Long Yin, SID: 14312497
  - Wong Tin Kam, SID: 13644525
- Workload division:
  - FANG Xifan: Database design, Mongoose models (User & Prompt), seed data
  - Ng Yin Ting: Frontend EJS pages, login/logout, UI layout
  - Fung Long Yin: REST API routes, CURL
  - Wong Tin Kam: Server setup, database connection

## 3. Project file intro
- `server.js`: It is responsible for starting the web server, connecting the application to MongoDB through Mongoose, configuring EJS and middleware, and integrating the login/logout, CRUD web pages and RESTful API routes.
- `package.json`: 
- `models/`: Contains Mongoose data models for MongoDB.
  - `User.js`: Defines user data structure including username and password.
  - `Prompt.js`: Defines prompt data structure including title, content, category and an owner reference linking to a User.
- `views/`: 
- `public/`: 

## 4. Operation guides
### 4.1 Use of Login/Logout pages


### 4.2 Use of CRUD web pages


### 4.3 Use of RESTful CRUD services & CURL test commands

The RESTful API is provided by `server.js` and returns JSON. **No login is required** for the API. All routes read and write the same MongoDB `prompts` collection as the web pages.

**Before testing**
1. Set `MONGODB_URI` in `.env` (or use the default local MongoDB) and run `node seed.js` once to create the sample data.
2. Start the server with `npm start` (it listens on port 8099).
3. Run the commands below in a second terminal.

**Prompt fields:** `title` (required), `content` (required), `category` (optional).

| Operation | HTTP method | Path URI | Request body | Success response |
|---|---|---|---|---|
| Read (list / search) | GET | `/api/prompts` | none. Optional query: `?title=...&category=...` (partial, case-insensitive match) | 200 + JSON array |
| Read (one) | GET | `/api/prompts/:id` | none | 200 + prompt, or 404 if not found |
| Create | POST | `/api/prompts` | JSON: `title`, `content`, `category` | 201 + created prompt |
| Update | PUT | `/api/prompts/:id` | JSON: `title`, `content`, `category` | 200 + updated prompt, or 404 if not found |
| Delete | DELETE | `/api/prompts/:id` | none | 200 + `{"message":"Prompt deleted successfully"}`, or 404 if not found |

**CURL test commands**

```bash
# 1. Read all prompts
curl http://localhost:8099/api/prompts

# 2. Read with search conditions
curl "http://localhost:8099/api/prompts?category=Art"
curl "http://localhost:8099/api/prompts?title=Prompt"

# 3. Create a prompt (copy the _id from the response)
curl -X POST -H "Content-Type: application/json" \
  --data '{"title":"Test","content":"Hello","category":"Study"}' \
  http://localhost:8099/api/prompts

# 4. Set the id returned above
ID=PASTE_THE_ID_HERE

# 5. Read one prompt
curl http://localhost:8099/api/prompts/$ID

# 6. Update the prompt
curl -X PUT -H "Content-Type: application/json" \
  --data '{"title":"Updated title","content":"Hello","category":"Study"}' \
  http://localhost:8099/api/prompts/$ID

# 7. Delete the prompt
curl -X DELETE http://localhost:8099/api/prompts/$ID

# 8. Not found example (returns 404 {"error":"Prompt not found"})
curl -i http://localhost:8099/api/prompts/000000000000000000000000
```

**Notes**
- Send a JSON body with the header `Content-Type: application/json`.
- Prompts created through the API have no `owner`, because the API needs no login.
- Error responses are JSON, for example `{"error":"Prompt not found"}`.


