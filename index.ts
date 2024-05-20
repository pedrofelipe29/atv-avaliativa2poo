
abstract class Item {
    constructor(nome: string, descricao: string) {
        this.nome = nome;
        this.descricao = descricao;
    }
    protected nome: string;
    protected descricao: string;

    getNome() {
        return this.nome
    }
    setNome(n: string) {
        this.nome = n
    }

    getDesc() {
        return this.descricao
    }
    setDesc(d: string) {
        this.descricao = d
    }
    abstract aplicarBeneficios(personagem: Personagem);

    abstract removerBeneficios(personagem: Personagem);
}

class ItemInventario {
    private quantidade: number;
    private item: Item

    constructor(quantidade: number, item: Item) {
        this.quantidade = quantidade;
        this.item = item;
    }

    getItem() {
        return this.item
    }
    getQuant() {
        return this.quantidade
    }
    setQuant(q: number) {
        this.quantidade = q
    }
}

class Arma extends Item {
    constructor(nome: string, descricao: string) {
        super(nome, descricao);
    }
    aplicarBeneficios(personagem: Personagem) {
        personagem.aumentarAtaque(10);
        personagem.aumentarDefesa(5);
    }

    removerBeneficios(personagem: Personagem) {
        personagem.diminuirAtaque(10);
        personagem.diminuirDefesa(5);
    }
}

class Pocao extends Item {
    constructor(nome: string, descricao: string) {
        super(nome, descricao);
    }
    aplicarBeneficios(personagem: Personagem) {
        const hpRestaurado = personagem.getMaxHP(0.5)
        const mpRestaurado = personagem.getMaxMP(0.2)
    }
    removerBeneficios(personagem: Personagem) { }
}
class Personagem {
    private nome: string;
    private ataque: number;
    private defesa: number;
    private hp: number;
    private mp: number;
    private inventario: Inventario;
    private arma: Arma;


    constructor(nome: string, ataque: number, defesa: number, hp: number, mp: number, inventario: Inventario, arma: Arma) {
        this.nome = nome
        this.ataque = ataque;
        this.defesa = defesa;
        this.hp = hp;
        this.mp = mp;
        this.inventario = inventario;
        this.arma = arma;
    }

    getNome() {
        return this.nome
    }
    getAtaque() {
        return this.ataque
    }
    getDefesa() {
        return this.defesa
    }
    getHP() {
        return this.hp
    }
    getMP() {
        return this.mp
    }
    getInventario() {
        return this.inventario
    }
    getArma() {
        return this.arma
    }

    aumentarAtaque(valor: number) {
        this.ataque += valor;
    }

    diminuirAtaque(valor: number) {
        this.ataque -= valor;
    }

    aumentarDefesa(valor: number) {
        this.defesa += valor;
    }

    diminuirDefesa(valor: number) {
        this.defesa -= valor;
    }

    getMaxHP(valor: number) {
        this.hp *= valor
    }

    getMaxMP(valor: number) {
        this.hp *= valor
    }

    abrirInventario() {
        console.log("Inventário:");
        this.inventario.getItensInv().forEach((item, indice) => {
            console.log(`${indice + 1} - ${item.getItem().getNome()} (${item.getQuant()})`);
        });
        console.log(`Total: ${this.inventario.getTotalItens()}/${this.inventario.getQuantidadeMaximaItens()}`);
    }

    usarItem(item: Item) {
        if (item instanceof Arma) {
            if (this.arma) {
                this.arma.removerBeneficios(this);
            }
            this.arma = item;
            this.arma.aplicarBeneficios(this);
        } else if (item instanceof Pocao) {
            item.aplicarBeneficios(this);

            for (let i = 0; i < this.inventario.getItensInv().length; i++) {

                if (this.inventario.getItensInv()[i].getItem().getNome() == item.getNome()) {
                    this.inventario.getItensInv()[i].setQuant(this.inventario.getItensInv()[i].getQuant() - 1);
                }

            }
        }
    }

    desequiparArma() {
        if (this.arma) {
            this.arma.removerBeneficios(this);
        } else {
            console.log("O personagem não está equipado com uma arma.");
        }
    }

    exibirInformacoes(): string {
        let info = `Nome: ${this.nome}\n`;
        info += `Ataque: ${this.ataque}\n`;
        info += `Defesa: ${this.defesa}\n`;
        info += `HP: ${this.hp}\n`;
        info += `MP: ${this.mp}\n`;
        info += `Arma equipada: ${this.arma ? this.arma.getNome() : 'Nenhuma'}\n`;
        info += `Inventário:\n`;
        this.inventario.getItensInv().forEach((item, indice) => {
            info += `${indice + 1} - ${item.getItem().getNome()} (${item.getQuant()})\n`;
        });
        info += `Total de itens: ${this.inventario.getTotalItens()}\n`;
        info += `Limite de itens no inventário: ${this.inventario.getQuantidadeMaximaItens()}\n`;
        return info;
    }
}

class Inventario {
    private itens: ItemInventario[];
    private quantidadeMaximaItens: number;

    constructor(quantidadeMaximaItens: number) {
        this.itens = []
        this.quantidadeMaximaItens = quantidadeMaximaItens
    }

    getItensInv() {
        return this.itens
    }

    getTotalItens(): number {
        return this.itens.reduce((total, item) => total + item.getQuant(), 0);
    }

    getQuantidadeMaximaItens(): number {
        return this.quantidadeMaximaItens;
    }

    adicionarItem(item: Item, quantidade: number = 1) {
        if (this.itens.length >= this.quantidadeMaximaItens) {
            throw new InventarioLimiteException("Inventário cheio.");
        }

        const itemExistente = this.itens.findIndex((element) => element.getItem() === item)
        if (itemExistente !== -1) {
            this.itens[itemExistente].setQuant(quantidade);
        } else {
            this.itens.push(new ItemInventario(quantidade, item));
        }
    }

    removerItem(item: Item) {
        const index = this.itens.findIndex(itemInv => itemInv.getItem() === item);
        if (index !== -1) {
            this.itens.splice(index, 1);
        }
    }

}

class InventarioLimiteException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InventarioLimiteException";
    }
}

class itemMenu {
    private opcao: string;
    private textoOpcao: string

    constructor(op: string, txtop: string) {
        this.opcao = op;
        this.textoOpcao = txtop;
    }

    getOp() {
        return this.opcao
    }
    setQuant(o: string) {
        this.opcao = o
    }

    getTxt() {
        return this.textoOpcao
    }
    setTxt(tx: string) {
        this.textoOpcao = tx
    }
}

class Menu {
    private itensMenu: itemMenu[];

    constructor() {
        this.itensMenu = [];
    }

    adicionarItemMenu(opcao: string, textoOpcao: string) {
        this.itensMenu.push(new itemMenu(opcao, textoOpcao));
    }

    imprimirMenu(): string {
        console.log("Opções do Menu:");
        this.itensMenu.forEach(item => {
            console.log(`${item.getOp}: ${item.getTxt}`);
        });

        return "";
    }
}

const menu = new Menu();

const opcaoSelecionada = menu.imprimirMenu();
console.log("Opção selecionada:", opcaoSelecionada);

const felipe= new Personagem("felipe", 10, 5, 15, 15, new Inventario(100), new Arma("Espada de Ferro", "Uma espada feita por um antigo ferreiro."))

class Aplicacao {
    private menu: Menu;
    private personagem: Personagem;

    constructor() {
        this.menu = new Menu();
        this.personagem = new Personagem("felipe", 10, 5, 15, 15, new Inventario(100), new Arma("Espada de Ferro", "Uma espada feita por um antigo ferreiro."));
        this.configurarMenu();
    }

    private configurarMenu() {
        this.menu.adicionarItemMenu('1', 'Equipar Arma');
        this.menu.adicionarItemMenu('2', 'Tomar Poção');
        this.menu.adicionarItemMenu('3', 'Adicionar Arma ao Inventário');
        this.menu.adicionarItemMenu('4', 'Adicionar Poção ao Inventário');
        this.menu.adicionarItemMenu('5', 'Imprimir Info');
        this.menu.adicionarItemMenu('6', 'Desequipar Arma');
        this.menu.adicionarItemMenu('0', 'Sair');
    }

    executar() {
        let opcaoSelecionada = '';
        while (opcaoSelecionada !== '0') {
            this.menu.imprimirMenu();
            opcaoSelecionada = this.obterOpcaoUsuario();
            this.processarOpcao(opcaoSelecionada);
        }
    }

    private obterOpcaoUsuario(): string {
        let entrada = require('prompt-sync')();
        let n = entrada('Digite a sua opção:');
        return entrada;
    }

    private processarOpcao(opcao: string) {
        switch (opcao) {
            case '1':
                this.equiparArma();
                break;
            case '2':
                this.tomarPocao();
                break;
            case '3':
                this.adicionarArmaAoInventario();
                break;
            case '4':
                this.adicionarPocaoAoInventario();
                break;
            case '5':
                console.log(this.personagem.exibirInformacoes());
                break;
            case '6':
                this.desequiparArma();
                break;
            case '0':
                console.log('Saindo da aplicação...');
                break;
            default:
                console.log('Opção inválida. Por favor, escolha uma opção válida.');
        }
    }

    private equiparArma() {
    }
    private tomarPocao() {
    }
    private adicionarArmaAoInventario() {

    }
    private adicionarPocaoAoInventario() {
    }
    private desequiparArma() {
    }
}

const app = new Aplicacao();
app.executar();

