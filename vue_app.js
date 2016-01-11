var App = Vue.extend({});
var router = new VueRouter();
window.users = [];
window.users.push(new User({login: "Manan", full: "Manan Wason", mail: "manan@mail.com", roles:['mentor','admin'],editing: false}));
window.users.push(new User({login: "Martin", full: "Martin", mail: "Martin@mail.com", roles:['mentor','admin'],editing: false}));
window.users.push(new User({login: "Nikunj", full: "Nikunj Thakkar", mail: "Nikunj@mail.com", roles:['mentor','admin'],editing: false}));
window.users.push(new User({login: "LisaHJ", full: "LisaHJ", mail: "LisaHJ@mail.com", roles:['mentor','admin'],editing: false}));
window.users.push(new User({login: "Yathannsh", full: "Yathannsh Kulshrestha", mail: "yathannsh@mail.com", roles:['student'],editing: false}));
function User(data) {
	data = data || { roles: [] };
	this.login = data.login,
	this.full = data.full;
	this.mail = data.mail;
	this.password = data.password;
	this.passwordConfirm = data.passwordConfirm;
	this.roles = data.roles;
	this.errorMessage = '';
	this.editing = false;
	this.addUser = function(index) {
		if(this.login && this.full && this.mail
			&& this.password && this.passwordConfirm) {
			
			if(this.password == this.passwordConfirm) {
				if(this.editing) {
					window.users[index] = this;
				} else {
					window.users.push(this);
					if(this.$route) 
						this.$route.router.go('/user');
				}
				
				this.errorMessage = '';
			}
			else {
				this.errorMessage = "Passwords are not equal!";
			}
		} else {
			this.errorMessage = "You should fill all fields!";
		}
	};	
	this.deleteUser = function(index) {
		if(window.users[index]) {
			$("#id-"+index).fadeOut('slow', function(){
				window.users.splice(index, 1);
			});			
		}
	}
}
router.map({
    '/register': {
		component: Vue.component('register', {
		  template: '#register-template',
		  data: function() {
			return new User();
		  },
		  methods: {
			registerUser: function() {
				this.addUser();
			}
		  }
		})
    },
	'/user': {
		component: Vue.component('user', {
		  template: '#user-template',
		  data: function() { 
			return {
				userCreation: new User(),
				users: window.users,
				registring: false,
				errorMessage: ''
			};
		  },
		  methods: {
			addUser: function() {
				this.userCreation = new User();
				this.registring = true;
				this.errorMessage = '';
			},
			cancelEditUser: function(index) {
				this.users[index].editing = false;
				this.errorMessage = '';
			},
			cancelAddUser: function(index) {
				this.registring = false;
				this.errorMessage = '';
			},
			editUser: function(index) {
				console.log(this);
				this.users[index].editing = true;
				this.errorMessage = '';
			},
			saveUser: function(index) {
				if(this.registring) {
					this.userCreation.addUser();
					this.errorMessage = this.userCreation.errorMessage;
					this.registring = (this.errorMessage != ''); 
				} else{
					this.users[index].addUser(index);
					this.errorMessage = this.userCreation.errorMessage;
					this.users[index].editing = (this.errorMessage != '');
				}
				
				if(this.errorMessage) {
					this.users = window.users;
				}
			},
			deleteUser: function(index) {
				this.users[index].deleteUser(index);
				this.errorMessage = '';
			}
		  }
		})
    },
});

// redirect
router.redirect({
'*': '/user'
})
router.start(App, '#app');