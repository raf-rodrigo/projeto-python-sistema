from django.test import TestCase, Client
from django.urls import reverse

class UsuarioViewsTestCase(TestCase):
    """
    Testes unitários simples para garantir a segurança e o mapeamento das rotas
    do módulo de administração de usuários.
    """
    def setUp(self):
        self.client = Client()

    def test_list_users_redirects_when_not_logged_in(self):
        # Deve redirecionar para a página de login caso a sessão não esteja iniciada
        response = self.client.get(reverse('list_users'))
        self.assertEqual(response.status_code, 302)
        self.assertIn('/login/', response.url)

    def test_create_user_redirects_when_not_logged_in(self):
        # Deve redirecionar para a página de login
        response = self.client.get(reverse('create_user'))
        self.assertEqual(response.status_code, 302)

    def test_edit_user_redirects_when_not_logged_in(self):
        # Deve redirecionar para a página de login
        response = self.client.get(reverse('edit_user', args=[1]))
        self.assertEqual(response.status_code, 302)

    def test_toggle_user_status_unauthorized_when_not_logged_in(self):
        # Deve retornar 401 (não autorizado) via AJAX
        response = self.client.post(reverse('toggle_user_status', args=[1]))
        self.assertEqual(response.status_code, 401)

    def test_reset_user_password_unauthorized_when_not_logged_in(self):
        # Deve retornar 401 (não autorizado) via AJAX
        response = self.client.post(reverse('reset_user_password', args=[1]))
        self.assertEqual(response.status_code, 401)
