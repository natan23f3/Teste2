import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/UI/Button';
import { Card, CardContent } from '../components/UI/Card';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Cabeçalho */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-blue-600 dark:text-blue-400 text-xl font-bold">FinFam</span>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              <a href="#features" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                Recursos
              </a>
              <a href="#pricing" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                Planos
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Registrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                Gerencie as finanças da sua família com facilidade
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                FinFam é a plataforma completa para controle financeiro familiar, 
                permitindo que você organize orçamentos, acompanhe despesas e alcance 
                metas financeiras em conjunto.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link to="/register">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Começar agora
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto text-white hover:bg-blue-700/30">
                    Saiba mais
                  </Button>
                </a>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="relative">
                <img 
                  src="https://via.placeholder.com/600x400?text=FinFam+Dashboard" 
                  alt="FinFam Dashboard" 
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Recursos poderosos para toda a família
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Descubra como o FinFam pode transformar a maneira como sua família lida com dinheiro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-blue-500">
              <CardContent>
                <div className="text-blue-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Orçamento colaborativo
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Crie e gerencie orçamentos em conjunto com todos os membros da família, 
                  estabelecendo metas e limites de gastos para cada categoria.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-green-500">
              <CardContent>
                <div className="text-green-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Controle de despesas
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Registre e categorize despesas facilmente, com visualização em tempo real 
                  dos gastos de toda a família e alertas quando os limites forem atingidos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-purple-500">
              <CardContent>
                <div className="text-purple-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Metas financeiras
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Defina metas financeiras para a família, como economizar para férias, 
                  educação ou aposentadoria, e acompanhe o progresso de forma visual.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Planos simples e transparentes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Escolha o plano ideal para as necessidades financeiras da sua família.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
              <CardContent>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Básico
                  </h3>
                  <div className="mt-4 flex justify-center">
                    <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                      Grátis
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Para famílias que estão começando a organizar suas finanças
                  </p>
                </div>
                <div className="mt-8">
                  <Link to="/register">
                    <Button variant="outline" fullWidth={true}>
                      Começar grátis
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500 dark:border-blue-400 shadow-lg relative">
              <div className="absolute top-0 inset-x-0 transform -translate-y-1/2">
                <div className="inline-block bg-blue-500 text-white text-sm font-semibold py-1 px-4 rounded-full">
                  Mais popular
                </div>
              </div>
              <CardContent>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Familiar
                  </h3>
                  <div className="mt-4 flex justify-center items-baseline">
                    <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                      R$19,90
                    </span>
                    <span className="ml-1 text-xl text-gray-500 dark:text-gray-400">
                      /mês
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Ideal para famílias que desejam controle financeiro completo
                  </p>
                </div>
                <div className="mt-8">
                  <Link to="/register">
                    <Button variant="primary" fullWidth={true}>
                      Assinar agora
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
              <CardContent>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Premium
                  </h3>
                  <div className="mt-4 flex justify-center items-baseline">
                    <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                      R$39,90
                    </span>
                    <span className="ml-1 text-xl text-gray-500 dark:text-gray-400">
                      /mês
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Para famílias que desejam o máximo em planejamento financeiro
                  </p>
                </div>
                <div className="mt-8">
                  <Link to="/register">
                    <Button variant="outline" fullWidth={true}>
                      Assinar Premium
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Pronto para transformar as finanças da sua família?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Junte-se a milhares de famílias que já estão economizando mais e realizando seus sonhos financeiros.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register">
              <Button variant="secondary" size="lg">
                Criar conta grátis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} FinFam. Todos os direitos reservados.
            </div>
            <div className="mt-4 md:mt-0 text-sm text-gray-500 dark:text-gray-400">
              Versão 1.0.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;