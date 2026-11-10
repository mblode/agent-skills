# Notification settings: brief

Product: Fernline (shared calendars for clinics). Platform: web, responsive down to 360px.
Languages at launch: English, German, Japanese.

## Job

A practice manager wants to cut down notification noise without missing a booking change.

## Settings on this screen

### Digest frequency

How often the summary email goes out. Exactly one of:

- Off
- Daily
- Weekly

Engineering's first pass used three checkboxes because the component already existed.

### Channels

Where urgent alerts are delivered. Any combination of:

- Email
- Push
- SMS
- Desk display

At least one must stay on. First pass used a dropdown that shows the one selected channel.

### Time zone

Used to schedule the digest. The list comes from the IANA database, about 420 entries. First pass used a radio list inside a scrolling box.

### Quiet hours

A start time and an end time. Alerts raised in that window are held until it ends. First pass used two native time inputs. Research had no complaints about these.

## Saving

Changes save as soon as a control changes. There is no Save button.

## What we need

Choose the control for each setting. We will hand the result to the UI team to build.
