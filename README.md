# MMM-MedReminder

A minimal MagicMirror module for daily medication reminders.

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

### Mark as taken

```bash
curl -X POST http://<mirror>:8080/notify \
  -H "Content-Type: application/json" \
  -d '{"notification":"MED_TAKEN"}'
```

### Reset manually

```bash
curl -X POST http://<mirror>:8080/notify \
  -H "Content-Type: application/json" \
  -d '{"notification":"MED_RESET"}'
```

---

## Behavior

* The reminder remains visible until confirmed
* After confirmation, a visual indicator is shown briefly
* After that, the module becomes invisible
* Reset happens automatically once per day

---

## Notes

* State is stored in browser localStorage
* Works without node_helper or backend
* Input can come from any source (scripts, GPIO, voice assistants, etc.)

---

## License

MIT
