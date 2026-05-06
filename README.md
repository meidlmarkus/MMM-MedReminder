# MMM-MedReminder

A minimal MagicMirror module for daily medication reminders that stay visible until confirmed.

---

## Features

* Visual reminder using a simple dot and text
* Confirmation via MagicMirror notifications
* Short visual feedback after confirmation
* Automatic daily reset (default: 03:00)
* No backend required

---

## Installation

```bash
cd ~/MagicMirror/modules
git clone https://github.com/meidlmarkus/MMM-MedReminder.git
```

---

## Configuration

Add the module to your `config.js`:

```js
{
  module: "MMM-MedReminder",
  position: "top_center",
  config: {
    text: "Take medication",
    resetHour: 3
  }
}
```

---

## Usage

The module reacts to MagicMirror notifications.

Notifications can be triggered from various sources, for example:

* shell scripts (e.g. using curl)  
  _Note: triggering notifications via HTTP requires a module such as `MMM-CurlToNotification`._
* hardware buttons (via GPIO scripts)
* existing MagicMirror button modules
* external integrations (voice assistants, home automation, etc.)

The module is typically placed in the `top_center` position, for example between weather and clock modules for good visibility.

### Example

In the morning you will see a reminder to take your medication:

<img width="100%" alt="Reminder active" src="https://github.com/user-attachments/assets/19a75af2-e895-478b-96d2-9dcc3d6db362" />

<br><br>

After confirming that you have taken the medication, a green dot is shown for 5 seconds, after which the reminder disappears:

<img width="100%" alt="Reminder confirmed" src="https://github.com/user-attachments/assets/121fca2f-e03b-4d22-94ea-c6229658e48a" />

### Mark as taken

If you are using curl, you can confirm that you have taken your medication by sending the following notification:

```bash
curl -X POST http://<mirror>:8080/notify \
  -H "Content-Type: application/json" \
  -d '{"notification":"MED_TAKEN"}'
```

### Reset manually

If you are using curl, you can manually reset the confirmation by sending the following notification, which will make the reminder reappear.

Note that the reset happens automatically at 03:00 by default.

```bash
curl -X POST http://<mirror>:8080/notify \
  -H "Content-Type: application/json" \
  -d '{"notification":"MED_RESET"}'
```

---

## Behavior

* The reminder remains visible until confirmed
* After confirmation, a visual indicator is shown briefly (default: 5 seconds)
* After that, the module becomes invisible
* The reminder resets automatically once per day (default: at 03:00)

---

## Notes

* State is stored in browser localStorage
* No backend or node_helper is required
* Input can come from any source
* HTTP-based triggering (e.g. using curl) requires a module such as `MMM-CurlToNotification`

---

## License

MIT
