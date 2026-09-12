export const TOPIC_CONTENT = {
  alphabet: { visual:'A B C', examples:['A for apple','B for ball','C for cat'], skill:'recognise letters and connect each letter to a familiar word' },
  numbers: { visual:'1 2 3', examples:['1 sun','2 eyes','3 wheels'], skill:'count objects and match a quantity to its numeral' },
  shapes: { visual:'● ▲ ■', examples:['circle','triangle','square'], skill:'identify common shapes by their sides and outlines' },
  colours: { visual:'🔴 🔵 🟡', examples:['red','blue','yellow'], skill:'name colours and match each colour to a visible object' },
  patterns: { visual:'▲ ● ▲ ●', examples:['AB','AAB','ABC'], skill:'observe a repeating sequence and choose what comes next' },
  animals: { visual:'🐘 🐯 🐶', examples:['elephant','tiger','dog'], skill:'recognise animals and group them by familiar features' },
  birds: { visual:'🐦 🦚 🦜', examples:['sparrow','peacock','parrot'], skill:'identify birds and notice beaks, wings and feathers' },
  fruits: { visual:'🍎 🍌 🍊', examples:['apple','banana','orange'], skill:'name fruits and distinguish them from other foods' },
  vegetables: { visual:'🥕 🍅 🥔', examples:['carrot','tomato','potato'], skill:'identify vegetables and connect them with everyday meals' },
  'body-parts': { visual:'👁️ 👂 ✋', examples:['eyes','ears','hands'], skill:'name body parts and connect each part with a simple function' },
  family: { visual:'👨‍👩‍👧', examples:['mother','father','child'], skill:'recognise family roles and describe caring relationships' },
  food: { visual:'🍚 🥛 🥭', examples:['rice','milk','mango'], skill:'identify familiar foods and talk about everyday eating habits' },
  vehicles: { visual:'🚗 🚌 🚲', examples:['car','bus','bicycle'], skill:'recognise vehicles and compare how people travel in them' },
  school: { visual:'🎒 📚 ✏️', examples:['school bag','book','pencil'], skill:'identify classroom items and match each item to its use' },
  'community-helpers': { visual:'👩‍⚕️ 👨‍🚒 👮', examples:['doctor','firefighter','police officer'], skill:'recognise community helpers and explain how they help people' },
  nature: { visual:'🌳 ☀️ 💧', examples:['tree','sun','water'], skill:'notice parts of the natural world and describe simple observations' },
  festivals: { visual:'🎉 🪔 🌸', examples:['festival lights','lamp','flowers'], skill:'recognise familiar celebration elements and discuss respectful participation' },
  india: { visual:'🇮🇳 🗺️ 🪷', examples:['India','national flag','lotus'], skill:'recognise familiar Indian symbols and places without stereotyping' },
  plants: { visual:'🌱 🌿 🌻', examples:['seedling','leaf','flower'], skill:'identify plant parts and describe a simple growth sequence' },
  'farm-agriculture': { visual:'🌾 🚜 🐄', examples:['crop','tractor','cow'], skill:'understand basic farm activities and where common food comes from' }
};

export function contentFor(topicId) {
  const item = TOPIC_CONTENT[topicId];
  if (!item) throw new Error(`Missing source content definition for topic: ${topicId}`);
  return item;
}
