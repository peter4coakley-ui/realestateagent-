# 🚀 ChatEditor Demo Guide

## Quick Start

### **1. Open the Editor**
```
Navigate to: /editor?imageUrl=YOUR_IMAGE_URL
```

### **2. Chat Opens Automatically**
- AI analyzes your image immediately
- Shows insights about the room
- Displays suggested quick actions

---

## 💬 Example Commands to Try

### **Interior Editing:**

```
"Make the walls ice blue"
"Change the flooring to hardwood"
"Paint the walls white"
"Add tile floors"
"Change to carpet"
```

### **Furniture Staging:**

```
"Add a modern sofa"
"Add a coffee table"
"Place an armchair"
"Add a floor lamp"
```

### **Object Removal:**

```
"Remove the table"
"Delete the chair"
"Remove that lamp"
```

### **Exterior Enhancements:**

```
"Enhance the grass"
"Improve the sky"
"Remove snow"
"Improve curb appeal"
"Change the siding"
```

---

## 🎯 Quick Actions

Simply click any suggested action:

1. 🔲 **Change flooring to hardwood**
2. 🎨 **Paint walls white**
3. 🛋️ **Add a modern sofa**
4. 🗑️ **Remove the table**
5. 💡 **Enhance lighting**
6. 🌳 **Enhance grass and trees**
7. 🏡 **Improve curb appeal**
8. ☁️ **Improve the sky**
9. ❄️ **Remove snow**

---

## 🎨 Sample Conversation

```
🤖 AI: I've analyzed this image. This is a living room. 
       I can see sofa, table, window. The dominant colors 
       are brown and beige with natural lighting. What 
       would you like to change?

👤 You: change the walls to ice blue

🤖 AI: I'll change the walls to ice blue. Processing now...

🤖 AI: Done! I've changed the walls to ice blue. What else 
       would you like to change?

👤 You: add a modern sofa

🤖 AI: I'll add a modern sofa. Processing now...

🤖 AI: Done! I've added a modern sofa. What else would you 
       like to change?

👤 You: change flooring to hardwood

🤖 AI: I'll change the flooring to hardwood. Processing now...

🤖 AI: Done! I've changed the flooring to hardwood. What 
       else would you like to change?
```

---

## 📊 What the AI Sees

When analyzing your image, the AI detects:

- **Room Type**: living_room, kitchen, bedroom, bathroom, exterior
- **Objects**: sofa, table, chair, lamp, window, etc.
- **Colors**: Dominant color palette (hex values)
- **Lighting**: natural, artificial, dim, bright
- **Suggestions**: Contextual quick actions

---

## 🎮 Interactive Features

### **Floating Toggle Buttons** (bottom-right):
1. 💬 **Chat Editor** - Opens AI chat interface
2. 🕐 **Edit History** - Shows timeline of edits

Only one can be open at a time. Click to toggle on/off.

### **Input Options:**
- **Type freely**: Natural language commands
- **Click suggestions**: Pre-defined quick actions
- **Enter to send**: Or click the send button
- **See examples**: Helpful tips below input

---

## 🔄 How It Works

```
┌─────────────────────────────────────────┐
│  1. You load an image                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  2. AI analyzes automatically           │
│     POST /api/analyze                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  3. Shows insights + suggestions        │
│     - Room type                         │
│     - Objects detected                  │
│     - Color palette                     │
│     - Quick actions                     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  4. You type a command                  │
│     "make the walls ice blue"           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  5. NLP parser extracts intent          │
│     type: 'walls'                       │
│     color: '#B0E0E6'                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  6. Adds to edit queue                  │
│     Queue → Processing → Complete       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  7. Calls Nano Banana API               │
│     POST /api/edit                      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  8. Updates canvas with result          │
│     Deducts credits                     │
│     Adds to history                     │
└─────────────────────────────────────────┘
```

---

## 💡 Pro Tips

1. **Be Specific**: "ice blue" vs "blue" gives different shades
2. **One at a Time**: For best results, wait for each edit
3. **Use Suggestions**: They're optimized for your image
4. **Check History**: See all edits in the history panel
5. **Undo Anytime**: Use undo/redo buttons in top bar

---

## 🎨 Color Names Supported

The AI understands these color names:

- **blue** → #4A90E2
- **ice blue** → #B0E0E6
- **green** → #7ED321
- **white** → #FFFFFF
- **beige** → #F5F5DC
- **gray** → #808080
- **yellow** → #F8E71C
- **red** → #D0021B

You can also use hex codes: "make walls #FF5733"

---

## 🛠️ Material Names Supported

### **Flooring:**
- hardwood
- tile
- carpet
- laminate
- vinyl

### **Furniture:**
- sofa / couch
- chair / armchair
- table / coffee table
- lamp / floor lamp
- plant

---

## 🏡 Exterior Operations

The AI can enhance exterior photos:

- **grass_enhance**: Makes lawn greener
- **sky_improve**: Enhances sky colors
- **snow_remove**: Removes snow from surfaces
- **siding_change**: Updates exterior siding

Simply say: "enhance the grass" or "improve the sky"

---

## 📱 Mobile Experience

On mobile devices:
- Chat opens in full-screen overlay
- Swipe to dismiss
- Touch-friendly buttons
- Simplified suggestions grid

---

## ⚡ Performance

- **Analysis**: ~1-2 seconds
- **Edit Processing**: ~2-5 seconds per edit
- **Queue Processing**: Sequential, no collisions
- **Real-time Updates**: Canvas updates instantly

---

## 🔐 Credit Usage

Each operation costs credits:

| Operation | Credits |
|-----------|---------|
| Flooring  | 1       |
| Walls     | 1       |
| Furniture | 1       |
| Remove    | 2       |
| Exterior  | 2       |
| Masking   | 1       |

Your balance is shown in the top bar.

---

## 🎯 Real-World Scenarios

### **Scenario 1: Living Room Makeover**
```
1. "change walls to white"        [1 credit]
2. "add hardwood floors"          [1 credit]
3. "add a modern sofa"            [1 credit]
4. "add a coffee table"           [1 credit]
───────────────────────────────────────────
Total: 4 credits, ~8-10 seconds
```

### **Scenario 2: Exterior Enhancement**
```
1. "enhance the grass"            [2 credits]
2. "improve the sky"              [2 credits]
3. "remove snow"                  [2 credits]
───────────────────────────────────────────
Total: 6 credits, ~12-15 seconds
```

### **Scenario 3: Virtual Staging**
```
1. Click "Add a modern sofa"      [1 credit]
2. Click "Add a coffee table"     [1 credit]
3. "add a floor lamp"             [1 credit]
4. "add a plant"                  [1 credit]
───────────────────────────────────────────
Total: 4 credits, complete staging!
```

---

## 🎉 Try It Now!

1. Navigate to `/editor`
2. Load an image
3. Wait for AI analysis
4. Try a command or click a suggestion
5. Watch the magic happen! ✨

---

## 📞 Need Help?

**Common Issues:**

- **"I'm not sure how to do that"**
  → Try a simpler command like "change walls to blue"

- **Edit not processing**
  → Check if you have sufficient credits

- **Vision analysis slow**
  → Large images take longer to analyze

- **Suggestions not appearing**
  → Refresh and reload the image

---

## 🚀 What's Next?

After you've tried the chat:

1. **Undo/Redo**: Use top bar buttons
2. **View History**: Click history toggle
3. **Download**: Add watermark and download
4. **Share**: Generate share link for clients

---

**Enjoy your AI-powered editing experience! 🎨✨**
