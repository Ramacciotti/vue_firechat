<!-- Html xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-->
<template>

    <!-- Formulário de Login que aparece se username estiver vazio --------------------------------------------------------------------------->
    <div class="view login" v-if="state.username === '' || state.username === null">

        <form class="login-form" @submit.prevent="Login">

            <div class="form-inner">

                <h1>Login to FireChat</h1>     

                <input type="text" v-model="inputUsername" placeholder="Please enter your username!"/>

                <input class="login-button" type="submit" placeholder="Login"/>

                <p>Developed by Mariana Ramacciotti</p>

            </div>

        </form>

    </div>

    <!-- Chat que só será mostrado após login --------------------------------------------------------------------------->
    <div class="view chat" v-else>

        <!-- Bloco 1 .........................................................................................-->    
        <header>

            <!-- Botão de logout -->    
            <button class="logout" @click="Logout">X</button>
            
            <!-- Mostra o nome escrito no input -->
            <h1>Welcome, {{ state.username }}</h1>

        </header>

        <!-- Bloco 2 .....................................................................................-->    
        <section class="chat-box">

            <!-- Loopa todas as mensagens da database e mostra cada uma num fundo cinza -->
            <div v-for="message in state.messages" :key="message.key" :class="(message.username == state.username ? 'message current-user' : 'message')">
            
                <div class="message-inner">

                    <div class="username">
                        {{message.username}}
                    </div>

                    <div class="content">
                        {{message.content}}
                    </div>
                    
                </div>

            </div>

        </section>

        <!-- Bloco 3 ........................................................................................-->    
        <footer>

            <form @submit.prevent="SendMessage">

                <!-- Input onde se escreve as mensagens -->    
                <input type="text" v-model="inputMessage" placeholder="Write a message..."/>
                
                <!-- Botão de enviar mensagem -->    
                <input type="submit" value="Send" />

            </form>

        </footer>


    </div>

</template>

<!-- Javascript xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-->
<script>

// Guarda variáveis que se atualizam
import { 
    reactive, 
    onMounted, 
    ref
} from 'vue';

// Da acesso a todas as funções da database
import db from "./db";

export default {

    setup() {

        // Variável que pega o que foi escrito no input --------------------------------------------------------------------------
        const inputUsername = ref("");
        const inputMessage = ref("");

        // Pega valores atuais dos inputs --------------------------------------------------------------------------------
        const state = reactive({
            username: "", // Username de quando estiver logado
            messages: [] // Mensagens escritas
        });

        // Função de Login ---------------------------------------------------------------------------------------------------
        const Login = () => {

            // Checa se o input está vazio
            if (inputUsername.value != "" || inputUsername.value != null) {
                
                state.username = inputUsername.value;
                // Se algo der errado, resetar
                inputUsername.value= "";
            }

        }

        // Função de Logout ---------------------------------------------------------------------------------------------------
        const Logout = () => {
            state.username = "";
        }

        // Mandar mensagem para a database ---------------------------------------------------------------------------------------------------
        const SendMessage = () => {

            // Conecta a database
            const messagesRef = db.database().ref("messages");
            
            // Se a mensagem estiver vazia...
            if (inputMessage.value === "" || inputMessage.value === null) {

                return;

            }

            // Mesagem que queremos enviar para database
            const message = {

                // Pega o username atual
                username: state.username,
                // Pega mensagem atual
                content: inputMessage.value

            }

            // Enviar msg para datbase
            messagesRef.push(message);

            // Limpa o formulário
            inputMessage.value = "";

        }

        // Após montar o app... ---------------------------------------------------------------------------------------------------
        onMounted(() => {

            // Pega a mensagem que foi escrita diretamente da database
            const messagesRef = db.database().ref("messages");

            // Checa se novas mensagens foram adicionadas
            messagesRef.on('value', snapshot => {
                
                // Pega a data de todas as mensagens lá na database
                const data = snapshot.val();
                
                // Guarda mensagens temporárias
                let messages = [];

                // Passa por todas as keys do data
                Object.keys(data).forEach(key => {
                    
                    // Passa um objeto
                    messages.push({
                        
                        // Pega a key da mensagem
                        id:key,
                        username: data[key].username,
                        content: data[key].content

                    });

                });

                //

                state.messages = messages;

            });
        });

        return {
            inputUsername,
            Login,
            state,
            inputMessage,
            SendMessage,
            Logout
        };
    },
};
</script>

<!-- Styles xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-->
<style src="./styles/styles.scss" lang="scss" scoped>
</style>
