# Work scheduler
- syncs with Google Calendar
- can export a report

## Usage docs
- first login to access the schedule page
- => schedule as you wish

## Technical docs
- **/public**
  - contains CSS, Images, JS
- **/routes**
  - takes care of requests for individual "/" pages
  - contains **.js** files
- **/views**
  - contains individual webpages in **.ejs**

#### EJS help
- **<%** 'Scriptlet' tag, for control-flow, no output
- **<%_** ‘Whitespace Slurping’ Scriptlet tag, strips all whitespace before it
- **<%=** Outputs the value into the template (HTML escaped)
- **<%-** Outputs the unescaped value into the template
- **<%#** Comment tag, no execution, no output
---
- **<%%** Outputs a literal '<%'
- **%>** Plain ending tag
- **-%>** Trim-mode ('newline slurp') tag, trims following newline
- **_%>** ‘Whitespace Slurping’ ending tag, removes all whitespace after it
