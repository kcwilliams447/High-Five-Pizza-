const pizzas=[
{
    name: "Cheese Pizza",
    type: "Cheese",
    description: "Mozzarella and tomato sauce",
    prices: [8,11,14],
    image: "images/Tahoe_Blue.png"
},{name:"High Five's Garden",type:"Veggie",description:"Spinach, Tomatoes, Mozzarella and tomato sauce",prices:[8,11,14]},
{name:"Pepperoni Pizza",type:"Meat",description:"Pepperoni, mozzarella and tomato sauce",prices:[9,12,15]},
{name:"Cluckin' Hot Pizza",type:"Meat",description:"Chicken, bacon, mozzarella and hot honey drizzle",prices:[11,14,17]},
{name:"Tahoe Blue",type:"Meat",description:"Pepperoni, Bacon, Jalapeno, blue cheese",prices:[11,14,17]},
{name:"Jeanna's Supreme",type:"Meat",description:"Pepperoni, sausage, peppers, onions, and mushrooms",prices:[11,14,17]}, {
}];
const sides = [
    {
        name: "Knockout Garlic Knots",
        description: "Fresh garlic knots with marinara sauce",
        price: 5.99
    },
    {
        name: "Mozzarella Sticks",
        description: "Crispy mozzarella sticks",
        price: 6.99
    
    },
    {
        name: "Buffalo Wings",
        description: "Eight buffalo wings",
        price: 10.99
    },
    {
        name: "Cheesy Bread",
        description: "Bread topped with melted mozzarella",
        price: 7.99
    }
];
let category="All Items",type="All Pizzas",selected=null,cart=[];
const $=id=>document.getElementById(id),money=n=>"$"+n.toFixed(2);
["All Items","Pizza","Sides","Drinks","Desserts","Specials"].forEach(c=>{const b=document.createElement("button");b.textContent=c;b.onclick=()=>{category=c;render()};$("nav").append(b)});
["All Pizzas","Cheese","Meat","Veggie"].forEach(t=>{const b=document.createElement("button");b.textContent=t;b.onclick=()=>{type=t;category="Pizza";render()};$("types").append(b)});
function render() {
    [...$("nav").children].forEach(b =>
        b.classList.toggle("active", b.textContent === category)
    );

    $("menu").replaceChildren();

    const q = $("search").value.toLowerCase();

    let items = [];

    if (category === "All Items" || category === "Pizza") {
        items.push(
            ...pizzas
                .filter(p => type === "All Pizzas" || p.type === type)
                .map(p => ({ ...p, category: "Pizza" }))
        );
    }

    if (category === "All Items" || category === "Sides") {
        items.push(...sides.map(s => ({ ...s, category: "Sides" })));
    }

    items = items.filter(p =>
        `${p.name} ${p.description}`.toLowerCase().includes(q)
    );

    if (!items.length) {
        $("menu").textContent = "No menu items found in this category yet.";
        return;
    }

    items.forEach(p => {
        const card = document.createElement("article");
        card.className = "pizza";

        const photo = document.createElement("div");
        photo.className = "photo";
        photo.textContent = p.category === "Pizza" ? "🍕" : "🍗";

        const title = document.createElement("h3");
        title.textContent = p.name;

        const desc = document.createElement("p");
        desc.textContent = p.description;

        const prices = document.createElement("p");

        if (p.category === "Pizza") {
            prices.textContent =
                `Small $${p.prices[0]} · Medium $${p.prices[1]} · Large $${p.prices[2]}`;
        } else {
            prices.textContent = money(p.price);
        }

        const btn = document.createElement("button");

        if (p.category === "Pizza") {
            btn.textContent = "Customize";

            btn.onclick = () => {
                selected = p;
                $("pizzaTitle").textContent = p.name;
                $("size").value = "small";
                $("cheese").checked = false;
                updatePrice();
                $("customize").showModal();
            };
        } else {
            btn.textContent = "Add to Cart";

            btn.onclick = () => {
                cart.push({
                    name: p.name,
                    size: "Regular",
                    extra: false,
                    price: p.price
                });

                $("count").textContent = cart.length;
            };
        }

        card.append(photo, title, desc, prices, btn);
        $("menu").append(card);
    });
}
function updatePrice(){if(!selected)return;const idx=["small","medium","large"].indexOf($("size").value);$("price").textContent="Price: "+money(selected.prices[idx]+($("cheese").checked?2:0))}
$("size").onchange=updatePrice;$("cheese").onchange=updatePrice;$("search").oninput=render;
$("add").onclick=()=>{if(!selected)return;const size=$("size").value,extra=$("cheese").checked;cart.push({name:selected.name,size,extra,price:selected.prices[["small","medium","large"].indexOf(size)]+(extra?2:0)});$("count").textContent=cart.length;$("customize").close()};
$("cartButton").onclick=()=>{const items=$("cartItems");items.replaceChildren();cart.forEach((item,i)=>{const line=document.createElement("div");line.textContent=`${item.name} (${item.size}${item.extra?", extra cheese":""}) — ${money(item.price)} `;const remove=document.createElement("button");remove.textContent="Remove";remove.onclick=()=>{cart.splice(i,1);$("count").textContent=cart.length;$("cartButton").click()};line.append(remove);items.append(line)});$("total").textContent="Total: "+money(cart.reduce((sum,item)=>sum+item.price,0));$("cartDialog").showModal()};
$("clearCart").onclick=()=>{cart=[];$("count").textContent=0;$("cartDialog").close()};
$("loginButton").onclick=()=>$("loginDialog").showModal();render();